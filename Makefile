parser.js: grammar.jison tokens.jisonlex
	node node_modules/jison/lib/cli.js $^ -o $@

test: parser.js
	@for f in tests/*.js; do sh scripts/test.sh $$f; done

.PHONY: test