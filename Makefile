.PHONY: install dev build lint format format-check clean check-tools

check-tools:
	@if ! command -v node >/dev/null 2>&1; then \
		echo "Node.js no esta instalado. Instalalo aqui: https://nodejs.org/"; \
		exit 1; \
	fi
	@if ! command -v pnpm >/dev/null 2>&1; then \
		echo "pnpm no esta instalado. Instalalo aqui: https://pnpm.io/installation"; \
		exit 1; \
	fi

install: check-tools
	pnpm install

dev:
	pnpm run start:dev

build:
	pnpm run build

lint:
	pnpm run lint

format:
	pnpm run format

format-check:
	pnpm run format:check

clean:
	rm -rf dist coverage node_modules
