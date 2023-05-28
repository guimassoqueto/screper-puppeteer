PACKAGE_MANAGER=npm
PACKAGE_MANAGER_RUN=npm run
HUSKY=npx husky install
GUI=xdg-open

## intall husky hooks and node dependencies
install:
	${HUSKY} && ${PACKAGE_MANAGER} install

## run dist/main.ts without transpile 
main:
	${PACKAGE_MANAGER_RUN} run:main

## create .env file from .env.example
env:
	cat .env.sample 1> .env

## transpile to typescript
build:
	${PACKAGE_MANAGER_RUN} build

## run all tests (slowly: with logs and details)
test:
	${PACKAGE_MANAGER_RUN} test

## run all tests in a simplified way (fastes, no logs, no info, no details)
test-simple:
	${PACKAGE_MANAGER_RUN} test:simplified

## run all unit tests (located in tests/unit)
test-unit:
	${PACKAGE_MANAGER_RUN} test:unit

## run all integratiopn tests (located in tests/integration)
test-int:
	${PACKAGE_MANAGER_RUN} test:integration

## run test on a specif file
test-file:
	${PACKAGE_MANAGER_RUN} test -- tests/unit/test-case.test.ts

## open repository page
or:
	open "https://github.com/guimassoqueto/scraper-puppeteer"

## open project folder in GUI
od:
	${GUI} .