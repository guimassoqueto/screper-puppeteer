import { AmazonProductPage } from './helper/amazon-product-page'

// B09L3TWVLB - comum - f
// B00H8W7N80 - relampago / percentual vendido - f
// B09S6P7ZV7 - recorrencia - f
// B08YR623QQ - ebooks - f
// 6555156961 - livro capa comum - f
// B0B64DBVBF - produtos com variacoes pre-selecionadas -f
// B07X6HW8NH - bebidas - oferta exclusiva prime

const screenshot = new AmazonProductPage('B00H8W7N80')

screenshot.takeScreenshot()
  .catch(error => { console.error(error) })
  .finally(() => { console.log('Done') })
