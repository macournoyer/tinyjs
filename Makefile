# Use jison bundled in node_modules.
# If installed globally, you could use simply: jison [args]
JISON = node node_modules/jison/lib/cli.js

all: parser.js demos/simple_parser.js

parser.js: grammar.jison tokens.jisonlex
	${JISON} $^ -o $@

demos/simple_parser.js: demos/simple_grammar.jison tokens.jisonlex
	${JISON} $^ -o $@	

test: parser.js
	@for f in tests/*.js; do sh scripts/test.sh $$f; done

.PHONY: test