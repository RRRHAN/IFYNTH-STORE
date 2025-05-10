package imageclassifier

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strings"
	"sync"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
)

type Predictor interface {
	Predict(ctx context.Context, imagePath string) (string, error)
	Close() error
}

type predictor struct {
	cmd    *exec.Cmd
	stdin  *bufio.Writer
	stdout *bufio.Scanner
	mutex  sync.Mutex
	ready  chan struct{}
}

// NewPredictor starts the predict executable and waits until the model is loaded.
func NewPredictor(config *config.Config) (Predictor, error) {
	if config.FeatureFlag.ImageClassifier {
		return &emptyPredictor{}, nil
	}

	log.Print("running predictor....")
	cmd := exec.Command("./predict")

	stdinPipe, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}

	stdoutPipe, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}

	scanner := bufio.NewScanner(stdoutPipe)
	writer := bufio.NewWriter(stdinPipe)

	p := &predictor{
		cmd:    cmd,
		stdin:  writer,
		stdout: scanner,
		ready:  make(chan struct{}),
	}

	if err := cmd.Start(); err != nil {
		return nil, err
	}

	// Wait for model to load
	go func() {
		for scanner.Scan() {
			line := scanner.Text()
			if strings.Contains(line, "loaded") {
				close(p.ready)
				break
			}
		}
	}()

	log.Print("waiting loading model to predictor")
	<-p.ready
	log.Print("predictor running succesfully")
	return p, nil
}

// Predict sends an image path and returns the predicted label.
func (p *predictor) Predict(ctx context.Context, imagePath string) (string, error) {
	p.mutex.Lock()
	defer p.mutex.Unlock()

	_, err := fmt.Fprintln(p.stdin, imagePath)
	if err != nil {
		return "", err
	}
	if err := p.stdin.Flush(); err != nil {
		return "", err
	}

	if p.stdout.Scan() {
		return p.stdout.Text(), nil
	}

	if err := p.stdout.Err(); err != nil {
		return "", err
	}
	return "", fmt.Errorf("no prediction returned")
}

// Close terminates the process.
func (p *predictor) Close() error {
	_, _ = fmt.Fprintln(p.stdin, "exit")
	_ = p.stdin.Flush()
	return p.cmd.Wait()
}

type emptyPredictor struct{}

func (p *emptyPredictor) Predict(ctx context.Context, imagePath string) (string, error) {
	return "", apierror.NewWarn(http.StatusServiceUnavailable, "image classifier is disabled")
}

func (p *emptyPredictor) Close() error {
	return nil
}
