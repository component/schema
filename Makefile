
C8=node_modules/.bin/component
TEST=node_modules/.bin/component-test

build: components index.js
	@$(C8) build --dev

clean:
	@rm -rf build components node_modules

components: component.json
	@$(C8) install --dev

node_modules: package.json
	@npm install

test: build
	@$(TEST) phantom

.PHONY: clean test
