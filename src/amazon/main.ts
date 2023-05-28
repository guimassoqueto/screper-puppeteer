import { getOffersFirstPageAndPageCount, scrapOffersPageAmazon } from './pupeteer-functions'
import { amazonOffersPage, addProductLinks, PRODUCTS_LINKS, DEALS_LINKS } from './interdependent-functions'
import { appendFile } from 'fs/promises'

async function main (): Promise<void> {
  const { firstPageURL } = await getOffersFirstPageAndPageCount()
  const prodDeals = await scrapOffersPageAmazon(amazonOffersPage(firstPageURL, 3))
  await addProductLinks(prodDeals)

  if (prodDeals?.deals) {
    while (prodDeals.deals.length) {
      const deal = prodDeals.deals.pop() as string
      const prods = await scrapOffersPageAmazon(deal)
      await addProductLinks(prods)
    }
  }

  while (DEALS_LINKS.length) {
    const deal = DEALS_LINKS.pop() as string
    const prods = await scrapOffersPageAmazon(deal)
    await addProductLinks(prods)
  }

  while (PRODUCTS_LINKS.length) {
    const productLink = PRODUCTS_LINKS.pop() as string
    await appendFile('links.txt', `${productLink}\n`, {
      encoding: 'utf-8'
    })
  }
}

(async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
  }
})()
  .catch(e => { console.error(e) })
  .finally(() => { console.info('Done') })
