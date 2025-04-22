# Stage 1: Build the Go app
FROM golang:1.21-alpine AS builder

# Set environment variables
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Create working directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the Go app
RUN go build -o app .

# Stage 2: Run the Go app in a minimal image
FROM alpine:latest

# Set working directory
WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/app .

# Expose the port your app runs on (e.g., 8080)
EXPOSE 8080

# Command to run the binary
ENTRYPOINT ["./app"]
