import 'dotenv/config'
import { Options } from 'amqplib'

export const SCREENSHOTS_LOCATION = process.env.SCREENSHOTS_LOCATION ?? './screenshots'
export const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER ?? "user"
export const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS ?? "password"
export const RABBITMQ_DEFAULT_HOST = process.env.RABBITMQ_DEFAULT_HOST ?? "localhost"
export const RABBITMQ_MAIN_QUEUE = process.env.RABBITMQ_MAIN_QUEUE ?? "soup-puppet"
export const RABBITMQ_URL = `amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_DEFAULT_HOST}:5672`
export const OPTIONS_ASSERT_QUEUE: Options.AssertQueue = { durable: false }