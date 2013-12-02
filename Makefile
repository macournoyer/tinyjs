parser.js: grammar.jison tokens.jisonlex
	jison $^ -o $@

test: parser.js
	@for f in tests/*.js; do sh scripts/test.sh $$f; done

size: tokens.jisonlex grammar.jison nodes.js eval.js runtime.js tiny.js
	@echo "     LOC   BYTES"
	@egrep -v "^[[:space:]]*(\/\/.*)?$$" $^ | wc -c -l

.PHONY: test size doc