import puppeteer from 'puppeteer'

interface FirstPageAndPageCount {
  firstPageURL: string
  pageCount: number
}

const PRODUCTS_LINKS: string[] = []
const DEALS_LINKS: string[] = []

interface ProdDeals {
  products: string[]
  deals: string[]
}

/**
 * Função que abre a página de ofertas do dia
 * @retorna URL da primeira página de ofertas, total de páginas de ofertas
 */
async function getFirstPageAndPageCount (): Promise<FirstPageAndPageCount> {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ height: 1080, width: 1920 })
  await page.goto('https://amazon.com.br/deals')

  const firstPageURL = await page.$eval('li>a', el => el.href)
  const pageCount = (await page.$$eval('li.a-disabled', li => li.map(element => element.textContent))).pop()

  await browser.close()

  if (firstPageURL && pageCount) return { firstPageURL, pageCount: Number.parseInt(pageCount) - 1 }
  throw new Error('Fail to get pages')
}
/**
 * Função que gera o link da página de ofertas
 * @param offersPageOneUrl url da primeira página de ofertas
 * (deve ser igual ao valor firstPageURL obtido da função getFirstPageAndPageCount)
 * @param pageNumber número da página que será gerada
 * (não deve ultrapassar o valor de pageCount obtido da função getFirstPageAndPageCount)
 * @returns a url da página de ofertas
 */
function amazonOffersPage (offersPageOneUrl: string, pageNumber: number): string {
  const pattern = '{{XXX}}'
  const url = offersPageOneUrl.replace('%253A0%', `%253A${pattern}0%`).replace(pattern, `${pageNumber === 0 ? '' : pageNumber}`)
  return url
}

async function runPuppeteerAmazon (url: string): Promise<ProdDeals | undefined> {
  console.info('Scraping offers from page ___. Please wait...')

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

  console.info('Getting all hrefs from page ___. Please wait...')
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
    const { firstPageURL } = await getFirstPageAndPageCount()
    const prodDeals = await runPuppeteerAmazon(amazonOffersPage(firstPageURL, 0))
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

    console.log(PRODUCTS_LINKS)
  } catch (error) {
    console.error(error)
  }
})()
  .finally(() => { console.log('Done') })
