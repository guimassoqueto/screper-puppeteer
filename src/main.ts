import { AmazonScreenshot } from "./amazon/amazon-screenshot.js";
import { createClient } from 'redis';

const client = createClient();
await client.connect();

let loop = true

while(loop) {
  if (client.isReady) {
    const raw_pids = await client.get('amazon_pids');
    if (raw_pids) { 
      loop = false
      const pids: string[] = JSON.parse(raw_pids)
      console.log(`${pids.length} pids added!`)
      let counter = 1;
      for (const pid of pids) {
        try {
          const screenshot = new AmazonScreenshot(pid, String(counter).padStart(3, '0'));
          await screenshot.takeScreenshot();
          counter += 1;
        } catch (error) {
          console.error(error)
          continue
        }
      }
      await client.del('amazon_pids')
      console.log("screenshots taken!")
      loop = true
    }
  } else {
    await client.connect()
  }
}