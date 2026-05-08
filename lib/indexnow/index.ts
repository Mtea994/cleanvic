/**
 * IndexNow protocol adapter — submits URLs to participating search engines
 * (Bing, Yandex, Seznam, Naver) via the unified api.indexnow.org endpoint.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * Key verification model: the caller publishes `key` at
 * `https://<host>/<key>.txt` (see `keyLocation` in the body). Search engines
 * fetch that file before crawling the submitted URLs to confirm the caller
 * owns the host.
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  ok: boolean;
  status: number;
  message: string;
  submitted: number;
}

export type FetchLike = (
  input: string,
  init: { method: string; headers: Record<string, string>; body: string },
) => Promise<{ status: number }>;

export interface PingIndexNowOptions {
  fetchImpl?: FetchLike;
}

export async function pingIndexNow(
  urls: string[],
  key: string,
  host: string,
  options: PingIndexNowOptions = {},
): Promise<IndexNowResult> {
  if (urls.length === 0) {
    return { ok: false, status: 0, message: "no urls to submit", submitted: 0 };
  }
  if (!key) {
    return { ok: false, status: 0, message: "missing key", submitted: 0 };
  }
  if (!host) {
    return { ok: false, status: 0, message: "missing host", submitted: 0 };
  }

  const fetchImpl = options.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);

  const body = JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  });

  let status: number;
  try {
    const res = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    status = res.status;
  } catch (err) {
    const message = err instanceof Error ? err.message : "fetch failed";
    return { ok: false, status: 0, message, submitted: 0 };
  }

  return interpret(status, urls.length);
}

function interpret(status: number, submitted: number): IndexNowResult {
  switch (status) {
    case 200:
      return { ok: true, status, submitted, message: "ok" };
    case 202:
      return {
        ok: true,
        status,
        submitted,
        message: "accepted — key validation pending",
      };
    case 400:
      return { ok: false, status, submitted: 0, message: "bad request — invalid format" };
    case 403:
      return {
        ok: false,
        status,
        submitted: 0,
        message: "forbidden — key not valid (key file not found or content mismatch)",
      };
    case 422:
      return {
        ok: false,
        status,
        submitted: 0,
        message:
          "unprocessable — URLs do not match the host, or key location does not match",
      };
    case 429:
      return { ok: false, status, submitted: 0, message: "rate limited" };
    default:
      return { ok: false, status, submitted: 0, message: `unexpected status ${status}` };
  }
}
