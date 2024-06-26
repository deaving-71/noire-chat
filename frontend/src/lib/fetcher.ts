import logger from "./logger"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

type FetcherOptions = Omit<RequestInit, "body"> & {
  body?: Object | any[]
}

export async function fetcher(url: string, opts?: FetcherOptions) {
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

  const response = await fetch(api(url), options)

  let result

  const contentType = response.headers.get("Content-Type")
  switch (contentType) {
    case "application/json; charset=utf-8":
      result = await response.json()
      break

    case "text/plain; charset=utf-8":
      result = await response.text()
      break

    default:
      result = null
      break
  }

  if (!response.ok) {
    if (
      (typeof result === "object" || typeof result === "function") &&
      result !== null
    )
      throw result

    throw result
  }

  return result
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
