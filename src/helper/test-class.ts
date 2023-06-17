import puppeteer, { type Browser, KnownDevices, type Page } from 'puppeteer'

export class AmazonProductPage {
  private readonly device = KnownDevices['iPhone 13 Pro Max']
  private browser: Browser
  private page: Page
  private readonly productUrl: string

  constructor (private readonly productCode: string) {
    this.productUrl = `https://www.amazon.com.br/dp/${this.productCode}`
  }

  async takeScreenshot (): Promise<void> {
    this.browser = await puppeteer.launch({ headless: 'new' })
    this.page = await this.browser.newPage()

    await this.page.emulate(this.device)
    await this.page.goto(this.productUrl)
    await this.page.evaluate(test)

    await this.page.screenshot({ path: `${this.productCode}.png` })
    await this.browser.close()
  }
}

function test (): void {
  // Hide header
  const header = document.getElementById('nav-main') as HTMLElement
  header.style.display = 'none'

  // scroll, from top, 65px
  window.scrollBy(0, 65)

  const productName = document.querySelector('#title') as HTMLElement
  productName.classList.replace('a-size-small', 'a-size-big')
  productName.style.fontWeight = '1000'

  // increase old price font size
  const previousPrices = document.querySelectorAll('span.a-price.a-text-price')
  if (previousPrices.length === 1) {
    const previousPrice = previousPrices[0] as HTMLElement
    previousPrice.style.fontSize = '24px'
  } else {
    const previousPrice = previousPrices[previousPrices.length - 1] as HTMLElement
    previousPrice.style.fontSize = '24px'
  }

  // remove the remain content from page
  const installmentsElement = document.querySelector('#installmentCalculator_feature_div') as HTMLElement
  installmentsElement.style.paddingBottom = '1000px'
}
