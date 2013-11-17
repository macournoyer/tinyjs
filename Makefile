parser.js: grammar.jison tokens.jisonlex
	jison $^ -o $@

test: tests/*.js
	@for f in $^; do sh test.sh $$f; done

loc: tokens.jisonlex grammar.jison nodes.js eval.js runtime.js tiny.js
	@egrep -v "^[[:space:]]*(\/\/.*)?$$" $^ | wc -l

.PHONY: test loc