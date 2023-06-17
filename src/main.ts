import puppeteer, { KnownDevices } from 'puppeteer'

const iPhone = KnownDevices['iPhone 13 Pro Max'];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.emulate(iPhone)
  await page.goto('https://www.amazon.com.br/dp/B084PVQGH1')

  await page.evaluate(() => {
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
  })

  await page.screenshot({ path: 'mobile_screenshot.png' })

  await browser.close()
})()
  .catch(error => { console.error(error) })
  .finally(() => { console.log('done') })
