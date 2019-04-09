import axios from 'axios'
import { URL } from 'url'

export const httpLoader = async (options: { url: URL }) => {
  const response = await axios.get(options.url.href)
  return { code: response.data }
}
