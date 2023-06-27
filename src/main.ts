import { AmazonProductPage } from './helper/amazon-product-page'

// B09L3TWVLB - comum - f
// B0B57HLN9K - relampago / percentual vendido - f
// B09S6P7ZV7 - recorrencia - f
// B09ZHZ9DN3 - meias / tenis / roupas de baixo - f
// B08YR623QQ - ebooks - f
// B07FB548ZM - variacoes
// B0BLCVLX88 - roupas

const screenshot = new AmazonProductPage('B09L3TWVLB')

screenshot.takeScreenshot()
  .catch(error => { console.error(error) })
  .finally(() => { console.log('Done') })
