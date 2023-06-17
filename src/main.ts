import { AmazonProductPage } from './helper/test-class'

const screenshot = new AmazonProductPage('B08F7DBTRX')

screenshot.takeScreenshot()
  .catch(error => { console.error(error) })
  .finally(() => { console.log('Done') })
