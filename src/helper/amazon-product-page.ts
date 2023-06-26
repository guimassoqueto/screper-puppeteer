import puppeteer, { type Browser, KnownDevices, type Page } from 'puppeteer'
import { fakeHeader } from './fake-header'

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
    await this.page.setExtraHTTPHeaders(fakeHeader())

    await this.page.emulate(this.device)
    await this.page.goto(this.productUrl, { waitUntil: 'networkidle0' })
    await this.page.evaluate(this.evaluate)

    await this.page.screenshot({ path: `./screenshots/${this.productCode}.png` })
    await this.browser.close()
  }

  private evaluate (): void {
    function changeElementStyle (querySelector: string, CSSProperty: string, CSSPropertyValue: string): void {
      const element = document.querySelector(querySelector) as HTMLElement
      if (element) element.style[CSSProperty] = CSSPropertyValue
    }

    // TEMPLATE: all
    changeElementStyle('#nav-main', 'display', 'none') // hide header
    changeElementStyle('#detailILMPercolate_feature_div', 'display', 'none') // hide top banner
    changeElementStyle('#dp', 'marginTop', '25px') // marginTop
    changeElementStyle('#acBadge_feature_div', 'display', 'none') // escolha da amazon

    const title = document.querySelector('#title') as HTMLElement // product title
    if (title) {
      title.classList.remove('a-size-small')
      title.style.fontSize = '20px'
      title.style.color = '#000'
    }

    const previousPrice = document.querySelector('span.a-price.a-text-price') as HTMLElement
    if (previousPrice) previousPrice.style.fontSize = '24px'
  }
}
