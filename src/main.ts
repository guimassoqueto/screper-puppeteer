import { AmazonScreenshot } from "./amazon/amazon-screenshot.js";

// TODO: implment redis to receive pids from python scrapy
const pids =[];

for (const pid of pids) {
  const screenshot = new AmazonScreenshot(pid);
  await screenshot.takeScreenshot();
}
