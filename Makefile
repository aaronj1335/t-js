test: 
	./node_modules/.bin/mocha --reporter list

web_test:
	open index.html

test_wrap:
	./bin/sigwrap make test


readme: README.md docs

README.md: t.js
	grep '^\/\/' < $< | sed -E 's|^//[ ]?||' > $@

docs: docs/t.html

docs/t.html: t.js
	docco $<


repo: .git/hooks/pre-commit

.git/hooks/pre-commit: bin/pre-commit
	cp $< $@


.PHONY: test web_test test_wrap
