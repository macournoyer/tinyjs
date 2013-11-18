parser.js: grammar.jison tokens.jisonlex
	jison $^ -o $@

test: parser.js
	@for f in tests/*.js; do sh test.sh $$f; done

loc: tokens.jisonlex grammar.jison nodes.js eval.js runtime.js tiny
	@egrep -v "^[[:space:]]*(\/\/.*)?$$" $^ | wc -l

doc: tokens.jisonlex grammar.jison nodes.js eval.js runtime.js tiny
	docco -l linear -e .js $^

.PHONY: test loc