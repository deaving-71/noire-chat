const BASE_URL = process.env.NEXT_PUBLIC_API_URL

type FetcherOptions = Omit<RequestInit, "body"> & {
  body?: Object | any[]
}

export const fetcher = (url: string, opts?: FetcherOptions) => {
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  const headers = { ...opts?.headers, ...defaultHeaders }
  const body = JSON.stringify(opts?.body)

  const options: RequestInit = {
    ...opts,
    body,
    headers,
    credentials: "include",
    mode: "cors",
  }

  return fetch(api(url), options)
}

/**
 *
 * @param url must start with a forward slash
 * @returns returns an absolute path to the api endpoint
 */
export function api(url: string) {
  const route = `${BASE_URL}${url}`
  return route
}
