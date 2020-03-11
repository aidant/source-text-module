import * as colours from 'https://deno.land/std/fmt/colors.ts'

export const log = (...args: string[]) => console.log(colours.cyan('Logger:'), ...args)
