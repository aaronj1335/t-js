test: 
	./node_modules/.bin/mocha --reporter list

web_test:
	open index.html

test_wrap:
	./bin/sigwrap make test


readme: README.md docs LICENSE

README.md: t.js
	grep '^\/\/' < $< | sed -E 's|^//[ ]?||' > $@
	echo >> $@
	echo 'license' >> $@
	echo '-------' >> $@
	cat LICENSE >> $@

docs: docs/t.html

docs/t.html: t.js
	docco $<


repo: .git/hooks/pre-commit .git/hooks/post-commit

.git/hooks/pre-commit: bin/pre-commit
	cp $< $@

.git/hooks/post-commit: bin/post-commit
	cp $< $@

.PHONY: test web_test test_wrap
