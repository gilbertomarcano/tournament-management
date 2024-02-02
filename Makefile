.SHELLFLAGS = -e

export project_name ?= tournament-management

.PHONY: api

build:
	docker-compose -f docker-compose.yml build

up:
	docker-compose -f docker-compose.yml -p ${project_name} up
