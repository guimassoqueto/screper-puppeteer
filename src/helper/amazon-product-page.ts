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

    function querySelectorElement (querySelector: string): null | HTMLElement {
      const element = document.querySelector(querySelector) as HTMLElement
      if (!element) return null
      return element
    }

    function isElementValid (querySelector: string, innerTextRegExp: RegExp): boolean {
      const elements = document.querySelectorAll('span.a-text-bold')
      if (!elements.length) return false

      for (const element of elements) {
        if (innerTextRegExp.test(element.innerText)) return true
      }

      return false
    }

    /** *************************TEMPLATE: all******************************/
    changeElementStyle('#nav-main', 'display', 'none') // elements/element-1
    changeElementStyle('#detailILMPercolate_feature_div', 'display', 'none') // elements/element-3
    changeElementStyle('#dp', 'marginTop', '25px') // marginTop
    changeElementStyle('#acBadge_feature_div', 'display', 'none') // elements/element-4
    changeElementStyle('#logoByLine_feature_div', 'display', 'none') // elements/element-5
    changeElementStyle('span.a-price.a-text-price', 'fontSize', '24px') // previous price
    changeElementStyle('span.basisPriceLegalMessage', 'display', 'none') // previous price info icon
    changeElementStyle('#basisPriceLegalMessage_feature_div', 'display', 'none') // elements/element-13
    changeElementStyle('span.a-declarative>a#trigger_installmentCalculator', 'display', 'none') // elements/element-9
    changeElementStyle('#image-block-pagination', 'display', 'none') // elements/element-10
    changeElementStyle('#deliveryBlockContainerMobile', 'marginTop', '5000px') // elements/element-15
    changeElementStyle('#icon-farm-widget-0', 'marginTop', '5000px') // elements/element-2

    const title = document.querySelector('#title') as HTMLElement // product title
    if (title) {
      title.classList.remove('a-size-small')
      title.style.fontSize = '20px'
      title.style.color = '#000'
    }

    /** *************************TEMPLATE: relampago******************************/
    const thunderDeal = querySelectorElement('div.a-section.a-spacing-none.celwidget>div.a-row.header-text>span.a-text-bold')
    if (thunderDeal && /oferta\srel.mpago/i.test(thunderDeal.innerText)) {
      changeElementStyle('#dealsAccordionRow', 'border', 'none')
      changeElementStyle('#claimBar_feature_div', 'display', 'none') // elements/element-7
      changeElementStyle('#promoPriceBlockMessage_feature_div', 'display', 'none') // elements/element-8
      changeElementStyle('#apex_mobile_feature_div>div.a-spacing-top-small', 'paddingBottom', '5000px')
    }

    /** *************************TEMPLATE: recorrente******************************/
    const isRecurrent = isElementValid('span.a-text-bold', /comprar.com.recorr.ncia/i)
    if (isRecurrent) {
      changeElementStyle('#mobile_buybox_feature_div', 'display', 'none') // elements/element-11
      changeElementStyle('#olpLinkWidget_feature_div', 'marginTop', '5000px') // elements/element-12
    }
  }
}
