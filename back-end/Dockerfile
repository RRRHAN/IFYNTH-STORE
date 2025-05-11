FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o app .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/app .

COPY --from=builder /app/predict /app/predict
COPY --from=builder /app/classes.json /app/classes.json

EXPOSE 7777

CMD ["./app"]
