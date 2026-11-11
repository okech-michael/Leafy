import app from './app.js'

const port = Number(process.env.PORT ?? 5000)
const server = app.listen(port, () => {
  console.info(`Leafy API listening on port ${port}`)
})

function stop(signal: string): void {
  console.info(`Received ${signal}; closing the Leafy API server.`)
  server.close((error) => {
    if (error) {
      console.error('Unable to close the Leafy API server cleanly.')
      process.exitCode = 1
      return
    }
    process.exit(0)
  })
}

process.once('SIGINT', () => stop('SIGINT'))
process.once('SIGTERM', () => stop('SIGTERM'))
