const main = async () => {
  const { log } = await import('./log.ts')
  log('Hello World!!!')
}

main()
  .catch(console.error)
