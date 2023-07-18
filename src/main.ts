import { AmazonScreenshot } from "./amazon/amazon-screenshot.js";
import { RabbitMQReceiver, TConsumer } from "./helpers/rabbitmq/receiver.js";

/**
 * a mensagem recebida (message) deve obrigatoriamente ser uma lista de pid para funcionar
 */
const message_handler: TConsumer = (channel) => {
  return async (message) => {
    if (message) {
      const pids = JSON.parse(message.content.toString());
      console.log(`${pids.length} pids added!`);

      for (const pid of pids) {
        try {
          const screenshot = new AmazonScreenshot(pid);
          await screenshot.takeScreenshot();
        } catch (error) {
          console.error(error);
          continue;
        }
      }
      channel.ack(message);
      console.log("screenshots taken");
    }
  };
};

try {
  console.log("Waiting for new messages...");
  await RabbitMQReceiver.receiver(message_handler);
} catch (error) {
  console.error(error);
}
