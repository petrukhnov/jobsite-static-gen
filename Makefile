node_modules: package.json
	@npm install

build: node_modules
	gulp -e dev build

test:
	@./node_modules/.bin/mocha --reporter spec

.PHONY: test build
