import { type ProdDeals } from './interfaces'

export const PRODUCTS_LINKS: string[] = []
export const DEALS_LINKS: string[] = []

/**
 * Função que gera o link da página de ofertas
 * @param offersPageOneUrl url da primeira página de ofertas
 * (deve ser igual ao valor firstPageURL obtido da função getFirstPageAndPageCount)
 * @param pageNumber número da página que será gerada
 * (não deve ultrapassar o valor de pageCount obtido da função getFirstPageAndPageCount)
 * @returns a url da página de ofertas
 */
export function amazonOffersPage (offersPageOneUrl: string, pageNumber: number): string {
  const pattern = '{{XXX}}'
  const url = offersPageOneUrl.replace('%253A0%', `%253A${pattern}0%`).replace(pattern, `${pageNumber === 0 ? '' : pageNumber}`)
  return url
}

export async function getProdOrDeal (url: string): Promise<void> {
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

export async function getProdsAndDeals (hrefs: string[]): Promise<ProdDeals> {
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

export async function addProductLinks (prodDeals: ProdDeals | undefined): Promise<void> {
  if (prodDeals?.products) PRODUCTS_LINKS.push(...prodDeals.products)
}
