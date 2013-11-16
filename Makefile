parser.js: grammar.jison tokens.jisonlex
	jison $^ -o $@