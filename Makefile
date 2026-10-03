.PHONY: install test build run docker-build docker-up

install:
	@echo "No external dependencies required for Warranty Vault"

test:
	python3 -m unittest discover -s tests -p "test_*.py" -v

build:
	@echo "Static HTML/CSS/JavaScript project - build check passed"
	test -f index.html
	test -f css/style.css
	test -f js/script.js
	@if command -v npm >/dev/null 2>&1; then npm run build; fi

run:
	@if command -v npm >/dev/null 2>&1; then npm run dev; else echo "Open index.html in a web browser"; fi

docker-build:
	@echo "Docker build not configured yet"

docker-up:
	docker compose up --build
