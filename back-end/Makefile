include .env
.PHONY: test wire

dev:
	nodemon --watch .env --watch '**/*.go' --ext go,env --exec "go run main.go" --signal SIGTERM --ignore data/

wire:
	cd ./wire && go run github.com/google/wire/cmd/wire

lint:
	golangci-lint run --timeout 5m -v

uncommit:
	git reset HEAD^

##################
### Migrations ###
##################

install-migration:
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

create-migration:
	migrate create -ext sql -dir ./migrations -seq ${NAME}

migrate:
	migrate -path ./migrations -database postgres://${BACKEND_DATABASE_USERNAME}:${BACKEND_DATABASE_PASSWORD}@${BACKEND_DATABASE_HOST}:${BACKEND_DATABASE_PORT}/${BACKEND_DATABASE_NAME}?sslmode=disable up

migrate-down:
	migrate -path ./migrations -database postgres://${BACKEND_DATABASE_USERNAME}:${BACKEND_DATABASE_PASSWORD}@${BACKEND_DATABASE_HOST}:${BACKEND_DATABASE_PORT}/${BACKEND_DATABASE_NAME}?sslmode=disable down ${N}

#########################
### Sync Dependencies ###
#########################

sync-dependencies:
	cd .. && ./sync-dependencies.sh back-end
	