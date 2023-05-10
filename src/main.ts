import puppeteer from 'puppeteer'

/**
 * The amazonLink changes daily, you must to know the differences every day
 * @param val
 * @returns string
 */
function amazonOffersPage (val: number): string {
  return `https://www.amazon.com.br/deals?ref_=nav_cs_gb&deals-widget=%257B%2522version%2522%253A1%252C%2522viewIndex%2522%253A${val}0%252C%2522presetId%2522%253A%2522deals-collection-all-deals%2522%252C%2522sorting%2522%253A%2522FEATURED%2522%257D`
}

interface ProdDeals {
  products: string[]
  deals: string[]
}

async function runPuppeteerAmazon (url: string): Promise<ProdDeals | undefined> {
  try {
    console.info(`Scraping offers from page ${1}. Please wait...`)

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto(url)

    console.info(`Getting all hrefs from page ${1}. Please wait...`)
    const hrefs = await page.$$eval('a', as => as.map(a => a.href))

    console.info('Hrefs extracted. Closing browser...')
    await browser.close()

    return await getProductsAndDeals(hrefs)
  } catch (error) {
    console.error(error)
  }
}

async function getProductsAndDeals (hrefs: string[]): Promise<ProdDeals> {
  console.info('Collecting products links and deals links. Please wait...')

  const products = new Set<string>()
  const deals = new Set<string>()

  for (const link of hrefs) {
    if (link.includes('/dp/')) {
      products.add(link.split('?')[0])
    }

    if (link.includes('/deal/')) {
      deals.add(link.split('?')[0])
    }

    if (link.includes('s?hidden-keywords=')) deals.add(link)
  }

  console.info('Product and Deals links collected.')
  console.info(`Product links: ${products.size}`)
  console.info(`Deals links: ${products.size}`)

  const data: ProdDeals = {
    products: Array.from(products),
    deals: Array.from(deals)
  }

  return await new Promise(resolve => { resolve(data) })
}

await (async () => {
  try {
    const prodDeals = await runPuppeteerAmazon(amazonOffersPage(3))
    if (!prodDeals) throw new Error('Error on getting data')
    const { products, deals } = prodDeals

    console.log(products)
    console.log(deals)
  } catch (error) {
    console.error(error)
  } finally {
    console.info('Done')
  }
})()
