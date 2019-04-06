export interface Toolkit {
  next(): symbol
}

type Plugin<Options, Result> = (
  options: Options,
  toolkit: Toolkit
) => Promise<Result | symbol>

const toolkit: Toolkit = {
  next: () => Symbol('next')
}

export const runPlugins = async <
  Callable extends Plugin<Options, Result>,
  Options,
  Result
>(
  plugins: Callable[],
  options: Options
): Promise<Result> => {
  for (const plugin of plugins) {
    const result = await plugin(options, toolkit)
    if (result === toolkit.next()) continue
    if (typeof result === 'symbol') throw new TypeError('wrong thing mate')
    return result
  }

  throw new Error('missing matching plugin')
}
