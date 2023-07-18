import client, { Connection, Channel, ConsumeMessage } from 'amqplib'
import { 
  RABBITMQ_URL,
  RABBITMQ_MAIN_QUEUE,
} from '../../settings.js'

export type TConsumer = (channel: Channel) => (message: ConsumeMessage | null) => Promise<void>

export class RabbitMQReceiver {
  static async receiver(message_handler: TConsumer) {
    const connection: Connection = await client.connect(RABBITMQ_URL)
    const channel: Channel = await connection.createChannel()
    await channel.assertQueue(RABBITMQ_MAIN_QUEUE, { durable: false })
    await channel.consume(RABBITMQ_MAIN_QUEUE, message_handler(channel), { noAck: false })
  }
}