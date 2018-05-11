.PHONY: default test

default: test

test:
	gulp clean
	gulp build test --prod
	@( cd bench; npm install; npm test; )
	npm run coverage:run

