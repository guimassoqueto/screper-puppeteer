i:
	npx husky install && npm install

tsw:
	npm run tsc:watch

nw:
	npm run node:watch

b:
	npm run tsc:build

js:
	id=$(id)
	@if [ -n "$id" ]; then make b && npm run js --id=$(id); fi
	
ts:
	npm run ts

## open repository page
or:
	open "https://github.com/guimassoqueto/scraper-puppeteer"