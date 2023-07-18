MOVE=mv /home/gmassoqueto/github-repos/python-flask-app/static/* /home/gmassoqueto/github-repos/python-flask-app/_static
CREATE=echo "123" 1> /home/gmassoqueto/github-repos/python-flask-app/static/123.txt

i:
	npm install && npx husky install

b:
	npm run build

js:
	${CREATE} && ${MOVE} && npm run js
	
ts:
	${CREATE} && ${MOVE} && npm run ts

## open repository page
or:
	open "https://github.com/guimassoqueto/scraper-puppeteer"
