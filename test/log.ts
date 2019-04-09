import * as colours from 'https://deno.land/std@v0.3.2/colors/mod.ts'

export const log = (...args: string[]) => console.log(colours.cyan('Logger:'), ...args)
