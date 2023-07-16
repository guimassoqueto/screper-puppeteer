import client, { Connection, Channel, ConsumeMessage } from 'amqplib'
import { 
  RABBITMQ_URL,
  RABBITMQ_MAIN_QUEUE,
  OPTIONS_ASSERT_QUEUE
} from '../../settings.js'

export type TConsumer = (channel: Channel) => (message: ConsumeMessage | null) => Promise<void>

export class RabbitMQReceiver {
  static async receiver(consumer) {
    const connection: Connection = await client.connect(RABBITMQ_URL)
    const channel: Channel = await connection.createChannel()
    await channel.assertQueue(RABBITMQ_MAIN_QUEUE, OPTIONS_ASSERT_QUEUE)
    await channel.consume(RABBITMQ_MAIN_QUEUE, consumer(channel))
  }
}