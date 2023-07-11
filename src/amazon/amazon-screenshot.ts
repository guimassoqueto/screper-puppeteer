import puppeteer, { type Browser, KnownDevices, type Page } from "puppeteer";
import { fakeHeader } from "../helpers/fake-header.js";

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

export class AmazonScreenshot {
  private readonly device = KnownDevices["iPhone 13 Pro Max"];
  private browser: Browser;
  private page: Page;
  private readonly productUrl: string;

  constructor(private readonly productCode: string) {
    this.productUrl = `https://www.amazon.com.br/dp/${this.productCode}`;
  }

  async takeScreenshot(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: minimal_args
    });
    this.page = await this.browser.newPage();
    await this.page.setExtraHTTPHeaders(fakeHeader());
    this.page.setDefaultTimeout(300000);

    await this.page.emulate(this.device);
    await this.page.goto(this.productUrl, { waitUntil: "networkidle2" });
    await this.page.evaluate(this.evaluate);

    await this.page.screenshot({
      path: `./screenshots/${this.productCode}.png`,
    });
    await this.browser.close();
  }

  private evaluate(): void {
    function changeElementStyle(
      querySelector: string,
      CSSProperty: string,
      CSSPropertyValue: string,
    ): void {
      const elements = Array.from(document.querySelectorAll(querySelector))
      for (const element of elements as Array<HTMLElement>) {
        if (element) element.style[CSSProperty] = CSSPropertyValue;
      }
    }

    function querySelectorElement(querySelector: string): null | HTMLElement {
      const element = document.querySelector(querySelector) as HTMLElement;
      if (!element) return null;
      return element;
    }

    function isElementValid(
      querySelectorAll: string,
      innerTextRegExp: RegExp,
    ): boolean {
      const elements = document.querySelectorAll(querySelectorAll);
      if (!elements.length) return false;

      for (const element of elements) {
        if (innerTextRegExp.test((element as HTMLElement).innerText)) {
          return true;
        }
      }

      return false;
    }

    /** *************************TEMPLATE: all******************************/
    changeElementStyle("#nav-main", "display", "none"); // elements/element-1
    changeElementStyle("#detailILMPercolate_feature_div", "display", "none"); // elements/element-3
    changeElementStyle("#dp", "marginTop", "25px"); // marginTop
    changeElementStyle("#acBadge_feature_div", "display", "none"); // elements/element-4
    changeElementStyle("#logoByLine_feature_div", "display", "none"); // elements/element-5
    changeElementStyle("span.a-price.a-text-price", "fontSize", "24px"); // previous price
    changeElementStyle("span.pricePerUnit", "display", "none"); // price per unit
    //span.aok-relative
    //span.a-size-mini a-color-base aok-align-center pricePerUnit
    changeElementStyle("span.basisPriceLegalMessage", "display", "none"); // previous price info icon
    changeElementStyle(
      "#basisPriceLegalMessage_feature_div",
      "display",
      "none",
    ); // elements/element-13
    changeElementStyle(
      "span.a-declarative>a#trigger_installmentCalculator",
      "display",
      "none",
    ); // elements/element-9
    changeElementStyle("#image-block-pagination", "display", "none"); // elements/element-10
    changeElementStyle("#deliveryBlockContainerMobile", "marginTop", "5000px"); // elements/element-15
    changeElementStyle("#icon-farm-widget-0", "marginTop", "5000px"); // elements/element-2
    changeElementStyle(
      "#socialProofingAsinFaceout_feature_div",
      "display",
      "none",
    ); // elements/element-18
    changeElementStyle(
      "div.a-accordion-row-a11y.a-accordion-row.a-declarative.accordion-header.mobb-header-css",
      "display",
      "none",
    ); // elements/element-19
    changeElementStyle(".a-declarative>div.ssf-background", "display", "none"); // elements/element-20
    changeElementStyle("#imageblock-360view-textlink", "display", "none"); // elements/element-20

    const title = document.querySelector("#title") as HTMLElement; // product title
    if (title) {
      title.classList.remove("a-size-small");
      title.style.fontSize = "20px";
      title.style.color = "#000";
    }

    /** *************************TEMPLATE: relampago******************************/
    const thunderDeal = querySelectorElement(
      "div.a-section.a-spacing-none.celwidget>div.a-row.header-text>span.a-text-bold",
    );
    if (thunderDeal && /oferta\srel.mpago/i.test(thunderDeal.innerText)) {
      changeElementStyle("#dealsAccordionRow", "border", "none");
      changeElementStyle("#claimBar_feature_div", "display", "none"); // elements/element-7
      changeElementStyle(
        "#promoPriceBlockMessage_feature_div",
        "display",
        "none",
      ); // elements/element-8
      changeElementStyle(
        "#apex_mobile_feature_div>div.a-spacing-top-small",
        "paddingBottom",
        "5000px",
      );
    }

    /** *************************TEMPLATE: recorrente******************************/
    const isRecurrent = isElementValid(
      "span.a-text-bold",
      /comprar.com.recorr.ncia/i,
    );
    if (isRecurrent) {
      changeElementStyle("#mobile_buybox_feature_div", "display", "none"); // elements/element-11
      changeElementStyle("#olpLinkWidget_feature_div", "marginTop", "5000px"); // elements/element-12
    }
    /** *************************TEMPLATE: livro (kindle ou capa comum) ******************************/
    const isBook = isElementValid("span.slot-title>span", /capa.comum|kindle/i);
    if (isBook) {
      changeElementStyle("#tmm-grid-saf", "display", "none"); // elements/element-14
      changeElementStyle(
        "#deliveryBlockContainerMobile",
        "marginTop",
        "5000px",
      ); // elements/element-15

      // case it is an kindle book
      changeElementStyle(
        "#KibboBuyboxMobileWeb_feature_div",
        "marginTop",
        "5000px",
      ); // elements/element-15
    }
    /** *************************TEMPLATE: produtos com variacoes pre-selecionadas ******************************/
    const preSelectedVariations = querySelectorElement(
      "#twister-plus-mobile-inline-twister",
    );
    if (preSelectedVariations && preSelectedVariations.children.length > 0) {
      changeElementStyle("#twisterController_feature_div", "display", "none");
    }
    /** *************************TEMPLATE: oferta exclusiva prime******************************/
    const isExclusivePrime = isElementValid(
      "span.a-text-bold",
      /oferta.exclusiva.prime/i,
    );
    if (isExclusivePrime) {
      changeElementStyle(
        "#mobile_primeSavingsUpsellAccordionRow",
        "border",
        "none",
      );
      changeElementStyle("#pep_feature_div", "marginTop", "5000px"); // elements/element-15
    }
    
/** *************************INNERTEXT: modifica a mensagem de calculo errado de juros******************************/
    const jurosDiv = querySelectorElement("#installmentCalculator_feature_div")
    if (jurosDiv) {
      jurosDiv.innerText = jurosDiv.innerText.replace("R$", "").replace(/[,\.]+/g, "").replace(/\d{3,}/g, "").replace(/\s{2,}/g, ' ')
    }
  }
}
