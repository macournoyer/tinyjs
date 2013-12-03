parser.js: grammar.jison tokens.jisonlex
	jison $^ -o $@

test: parser.js
	@for f in tests/*.js; do sh scripts/test.sh $$f; done

.PHONY: test