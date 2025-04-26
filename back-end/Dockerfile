FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o app .

# Stage 2: Run
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/app .

EXPOSE 7777
CMD ["./app"]
