include .env

ssh:
	ssh ${VPS_USER}@${VPS_IP}

upload-env:
	scp .env ${VPS_USER}@${VPS_IP}:~/IFYNTH-STORE/.env

upload-model:
	scp ./image-classifier/dist/predict ${VPS_USER}@${VPS_IP}:~/IFYNTH-STORE/back-end/predict
	scp ./image-classifier/classes.json ${VPS_USER}@${VPS_IP}:~/IFYNTH-STORE/back-end/classes.json