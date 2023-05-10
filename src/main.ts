import puppeteer from 'puppeteer'

const PRODUCTS_LINKS: string[] = []
const DEALS_LINKS: string[] = []

function amazonOffersPage (val: number): string {
  return `https://www.amazon.com.br/deals?ref_=nav_cs_gb&deals-widget=%257B%2522version%2522%253A1%252C%2522viewIndex%2522%253A${val === 0 ? '' : val}0%252C%2522presetId%2522%253A%2522deals-collection-all-deals%2522%252C%2522sorting%2522%253A%2522FEATURED%2522%257D`
}

interface ProdDeals {
  products: string[]
  deals: string[]
}

async function runPuppeteerAmazon (url: string): Promise<ProdDeals | undefined> {
  console.info(`Scraping offers from page ${1}. Please wait...`)

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.goto(url)

  // if there is an redirect to a product page ou another page
  if (page.url() !== url) {
    console.info('The page was redirected, verifying the new URL...')
    await browser.close()
    await getProdOrDeal(page.url())
    return
  }

  console.info(`Getting all hrefs from page ${1}. Please wait...`)
  const hrefs = await page.$$eval('a', as => as.map(a => a.href))

  console.info('Hrefs extracted. Closing browser...')
  await browser.close()

  return await getProdsAndDeals(hrefs)
}

async function getProdOrDeal (url: string): Promise<void> {
  let products: Set<string> | string[] = new Set<string>()
  let deals: Set<string> | string[] = new Set<string>()

  if (url.includes('/dp/')) {
    products.add(url.split('?')[0])
  }

  if (url.includes('/deal/')) {
    deals.add(url.split('?')[0])
  }

  if (url.includes('s?hidden-keywords=')) deals.add(url)

  products = Array.from(products)
  deals = Array.from(deals)

  PRODUCTS_LINKS.push(...products)
  DEALS_LINKS.push(...deals)
}

async function getProdsAndDeals (hrefs: string[]): Promise<ProdDeals> {
  console.info('Collecting products links and deals links. Please wait...')

  let products: Set<string> | string[] = new Set<string>()
  let deals: Set<string> | string[] = new Set<string>()

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

  products = Array.from(products)
  deals = Array.from(deals)

  console.info(`Product links: ${products.length}`)
  console.info(`Deals links: ${deals.length}`)

  const data: ProdDeals = { products, deals }

  return await new Promise(resolve => { resolve(data) })
}

async function addProductLinks (prodDeals: ProdDeals | undefined): Promise<void> {
  if (prodDeals?.products) PRODUCTS_LINKS.push(...prodDeals.products)
}

(async () => {
  try {
    const prodDeals = await runPuppeteerAmazon(amazonOffersPage(0))
    await addProductLinks(prodDeals)

    if (prodDeals?.deals) {
      while (prodDeals.deals.length) {
        const deal = prodDeals.deals.pop() as string
        const prods = await runPuppeteerAmazon(deal)
        await addProductLinks(prods)
      }
    }

    while (DEALS_LINKS.length) {
      const deal = DEALS_LINKS.pop() as string
      const prods = await runPuppeteerAmazon(deal)
      await addProductLinks(prods)
    }
  } catch (error) {
    console.error(error)
  }
})()
  .finally(() => { console.log(PRODUCTS_LINKS) })
