test: 
	./node_modules/.bin/mocha --reporter list

web_test:
	open index.html

test_wrap:
	./bin/sigwrap make test

readme: README.md

README.md: docs
	grep '^\/\/' < t.js | sed -E 's|^//[ ]?||' > README.md

docs:
	docco t.js

repo: .git/hooks/pre-commit

.git/hooks/pre-commit:
	cp bin/pre-commit .git/hooks/

.PHONY: test web_test test_wrap repo readme
