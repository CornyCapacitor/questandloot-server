import dotenv from 'dotenv'
import express, { Application, Request, Response } from 'express'

// Env files config
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3333

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server!')
})

app.listen(PORT, () => {
  console.log(`Server is fire at https://localhost:${PORT}`)
})