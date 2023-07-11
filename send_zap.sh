#! /usr/bin/bash

PUPPETEER_SCREENSHOTS_FOLDER="/home/gmassoqueto/github-repos/scraper-puppeteer/screenshots"
NGROK_URL=$1

for filename in `ls "$PUPPETEER_SCREENSHOTS_FOLDER"`; do
	name=$(basename "$filename" | cut -d. -f1)
    echo $name
    # text
    curl --output /dev/null --silent --location "https://graph.facebook.com/v17.0/109390515548294/messages" --header "Authorization: Bearer EAAELIICD3L4BAH60gBHkefPwcnaci5N5b9lYAfcCAXhmd8ru0U2Qx3NlLQDT2u9ZCO2mbE5zVHMmiKX9wvUWMotLgZBbubcbZAyzlyzZCteyQM1ARHmgitD19UGvcO1GwSZBZAMyXQKvVtFd3KuT1RdXZAcgKV5hfaxdWwICFyS4DvVlEIydZCJUBi6XzqQBUmqtsbmgoNiyehYIqkdERJofZAYMyWGZAH7LAZD" --header "Content-Type: application/json" --data "{ \"messaging_product\": \"whatsapp\", \"to\": \"5541992945690\", \"type\": \"text\", \"text\": { \"body\": \"https://amazon.com.br/dp/"$name"\" } }"
    sleep 1
    
    #image
    curl --output /dev/null --silent --location "https://graph.facebook.com/v17.0/109390515548294/messages" --header "Authorization: Bearer EAAELIICD3L4BAH60gBHkefPwcnaci5N5b9lYAfcCAXhmd8ru0U2Qx3NlLQDT2u9ZCO2mbE5zVHMmiKX9wvUWMotLgZBbubcbZAyzlyzZCteyQM1ARHmgitD19UGvcO1GwSZBZAMyXQKvVtFd3KuT1RdXZAcgKV5hfaxdWwICFyS4DvVlEIydZCJUBi6XzqQBUmqtsbmgoNiyehYIqkdERJofZAYMyWGZAH7LAZD" --header "Content-Type: application/json" --data "{ \"messaging_product\": \"whatsapp\", \"to\": \"5541992945690\", \"type\": \"image\", \"image\": { \"link\": \""$NGROK_URL"/"$filename"\" } }"
    sleep 3
done;


# remove todas as images da pasta se existem arquivos lá dentro
if [ "$(ls -A "$PUPPETEER_SCREENSHOTS_FOLDER")" ]; then
    rm "$PUPPETEER_SCREENSHOTS_FOLDER"/*
fi
