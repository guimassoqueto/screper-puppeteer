MOVE=mv /home/gmassoqueto/github-repos/python-flask-app/static/* /home/gmassoqueto/github-repos/python-flask-app/_static

i:
	npm install && npx husky install

b:
	npm run build

js:
	${MOVE} && npm run js
	
ts:
	${MOVE} && npm run ts

## open repository page
or:
	open "https://github.com/guimassoqueto/scraper-puppeteer"