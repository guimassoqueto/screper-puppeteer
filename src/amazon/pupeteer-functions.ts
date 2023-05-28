import puppeteer from 'puppeteer'
import { getProdOrDeal, getProdsAndDeals } from './interdependent-functions'
import { type FirstPageAndPageCount, type ProdDeals } from './interfaces'

/**
 * Função que abre a página de ofertas do dia
 * @retorna URL da primeira página de ofertas, total de páginas de ofertas
 */
export async function getOffersFirstPageAndPageCount (): Promise<FirstPageAndPageCount> {
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

export async function scrapOffersPageAmazon (url: string): Promise<ProdDeals | undefined> {
  console.info('Scraping offers from page ___. Please wait...')

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.goto(url)

  // if there is an redirect to a product page or another page
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
