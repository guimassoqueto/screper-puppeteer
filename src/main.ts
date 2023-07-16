import { AmazonScreenshot } from "./amazon/amazon-screenshot.js";
import { RabbitMQReceiver, TConsumer } from './helpers/rabbitmq/receiver.js'


const consumer = (channel) => {
  return async (message) => {
    if (message) {
      const pids = JSON.parse(message.content.toString())
      console.log(`${pids.length} pids added!`)
      let counter = 1
      for (const pid of pids) {
        try {
          const screenshot = new AmazonScreenshot(pid);
          await screenshot.takeScreenshot();
          counter += 1;
        } catch (error) {
          console.error(error)
          continue
        }
      }
      channel.ack(message)
      console.log('screenshots taken')
    }
  }
}

try {
  console.log('Waiting for new messages...')
  await RabbitMQReceiver.receiver(consumer)
}
catch(error) {
  console.error(error)
}