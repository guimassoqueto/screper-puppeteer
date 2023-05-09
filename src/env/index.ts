import * as dotenv from 'dotenv'
dotenv.config()

export const HTTP_PROXY = process.env.HTTP_PROXY ?? ''
