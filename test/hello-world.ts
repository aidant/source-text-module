const main = async () => {
  const { log } = await import('./log')
  log('Hello World!!!')
}

main()
  .catch(console.error)
