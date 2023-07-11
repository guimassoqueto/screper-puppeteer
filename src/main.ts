import { AmazonScreenshot } from "./amazon/amazon-screenshot.js";
import { createClient } from 'redis';

const client = createClient();
await client.connect();

let loop = true

while(loop) {
  if (client.isReady) {
    const raw_pids = await client.get('amazon_pids');
    if (raw_pids) { 
      console.log("new pids found!")
      loop = false
      const pids: string[] = JSON.parse(raw_pids)
      for (const pid of pids) {
        const screenshot = new AmazonScreenshot(pid);
        await screenshot.takeScreenshot();
      }
      await client.del('amazon_pids')
      console.log("screenshots taken!")
      loop = true
    }
  } else {
    await client.connect()
  }
}