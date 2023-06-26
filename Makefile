PACKAGE_MANAGER=npm
PACKAGE_MANAGER_RUN=npm run
HUSKY=npx husky install
GUI=xdg-open

## intall husky hooks and node dependencies
i:
	${HUSKY} && ${PACKAGE_MANAGER} install

## run dist/main.ts without transpile 
sts:
	${PACKAGE_MANAGER_RUN} run:ts

## run dist/main.ts without transpile 
sjs:
	rm -rf dist/ && ${PACKAGE_MANAGER_RUN} build && ${PACKAGE_MANAGER_RUN} run:js

## create .env file from .env.example
env:
	cat .env.sample 1> .env

## transpile to typescript
b:
	${PACKAGE_MANAGER_RUN} build

## run all tests (slowly: with logs and details)
t:
	${PACKAGE_MANAGER_RUN} test

## run all tests in a simplified way (fastes, no logs, no info, no details)
ts:
	${PACKAGE_MANAGER_RUN} test:simplified

## run all unit tests (located in tests/unit)
tu:
	${PACKAGE_MANAGER_RUN} test:unit

## run all integratiopn tests (located in tests/integration)
ti:
	${PACKAGE_MANAGER_RUN} test:integration

## run test on a specif file
tf:
	${PACKAGE_MANAGER_RUN} test -- tests/unit/test-case.test.ts

## open repository page
or:
	open "https://github.com/guimassoqueto/scraper-puppeteer"

## open project folder in GUI
od:
	${GUI} .