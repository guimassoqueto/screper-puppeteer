import { AmazonProductPage } from './helper/amazon-product-page'

const screenshot = new AmazonProductPage('<PRODUCT_ID_AMAZON>')

screenshot.takeScreenshot()
  .catch(error => { console.error(error) })
  .finally(() => { console.log('Done') })
