import puppeteer from 'puppeteer'

function amazonOffersPage (val: number): string {
  return `https://www.amazon.com.br/deals?ref_=nav_cs_gb&deals-widget=%257B%2522version%2522%253A1%252C%2522viewIndex%2522%253A${val}0%252C%2522presetId%2522%253A%2522deals-collection-4-stars-and-up%2522%252C%2522sorting%2522%253A%2522FEATURED%2522%257D`
}

async function getLinks (url: string): Promise<[string[], string[]] | undefined> {
  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto(url)

    const links = await page.$$eval('a', as => as.map(a => a.href))

    const products = new Set<string>()
    const deals = new Set<string>()

    for (const link of links) {
      if (link.includes('/dp/')) {
        products.add(link.split('?')[0])
      }

      if (link.includes('/deal/')) {
        deals.add(link.split('?')[0])
      }

      if (link.includes('s?hidden-keywords=')) deals.add(link)
    }

    await browser.close()

    return [Array.from(products), Array.from(deals)]
  } catch (error) {
    console.error(error)
  }
}

(async () => {
  const productsLinksList: string[] = []
  const dealsLinksList: string[] = []

  let i = 0
  while (i <= 3) {
    const productsDeals = await getLinks(amazonOffersPage(i))

    if (productsDeals) {
      const [products, deals] = productsDeals
      productsLinksList.push(...products)
      dealsLinksList.push(...deals)
    }
    i += 3
  }

  while (dealsLinksList.length > 0) {
    const productLink = dealsLinksList.pop()
    const productsDeals = await getLinks(productLink as string)

    if (productsDeals) {
      // const [products, _] = productsDeals
      productsLinksList.push(...productsDeals[0])
    }
  }

  console.log(productsLinksList)
  console.log(dealsLinksList)
})()
  .finally(() => { console.log('done') })
