# Use jison bundled in node_modules.
# If installed globally, you could use simply: jison [args]
JISON = node node_modules/jison/lib/cli.js
MOCHA = node node_modules/mocha/bin/mocha

all: parser.js demos/simple_parser.js

browserify: all
	browserify browser.js -o bundle.js

parser.js: grammar.jison tokens.jisonlex
	${JISON} $^ -o $@

demos/simple_parser.js: demos/simple_grammar.jison tokens.jisonlex
	${JISON} $^ -o $@	

test: parser.js
	${MOCHA}
	make test-samples

test-samples:
	@for f in samples/*.js; do sh scripts/compare_outputs.sh $$f; done	

test-lexer: parser.js
	${MOCHA} test/lexer_test.js

test-parser: parser.js
	${MOCHA} test/parser_test.js

test-runtime: parser.js
	${MOCHA} test/runtime_test.js

test-interpreter: parser.js
	${MOCHA} test/interpreter_test.js

.PHONY: browserify test test-samples test-lexer test-parser test-runtime test-interpreter