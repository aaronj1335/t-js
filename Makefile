test: 
	./node_modules/.bin/mocha --reporter list

web_test:
	open index.html

test_wrap:
	./bin/sigwrap make test

docs:
	docco t.js

readme:
	grep '^\/\/' < t.js | sed -E 's|^//[ ]?||' > README.md

.PHONY: test web_test test_wrap docs readme
