test: 
	./node_modules/.bin/mocha --reporter list

test_wrap:
	./bin/sigwrap make test

.PHONY: test
