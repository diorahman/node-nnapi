REPORTER = spec

test: test-all

test-all:
	/usr/local/bin/mocha --reporter $(REPORTER) test/*.js -t 9000000

test-write:
	/usr/local/bin/mocha --reporter $(REPORTER) test/write.js -t 9000000

test-read:
	/usr/local/bin/mocha --reporter $(REPORTER) test/read.js -t 9000000


.PHONY: test test-all test-write
