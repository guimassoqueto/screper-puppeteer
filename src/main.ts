import { AmazonProductPage } from './helper/amazon-product-page'

// B00863NRHQ - temporario
// B07FB548ZM - variacoes
// B000WH0X9E - relampago
// B07522WHGC - ebooks
// B09V48865W - iphone
// B0BLCVLX88 - roupas
// B0BVWG1BV2 - meias/tenis

const screenshot = new AmazonProductPage('B0BVWG1BV2')

screenshot.takeScreenshot()
  .catch(error => { console.error(error) })
  .finally(() => { console.log('Done') })
