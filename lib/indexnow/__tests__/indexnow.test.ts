import { describe, it, expect, vi } from "vitest";
import { pingIndexNow, type FetchLike } from "../index";

const URLS = [
  "https://kleanvictoria.com.au/",
  "https://kleanvictoria.com.au/carpet-cleaning",
];
const KEY = "abcdef0123456789abcdef0123456789";
const HOST = "kleanvictoria.com.au";

function fetchReturning(status: number): FetchLike {
  return vi.fn(async () => ({ status }));
}

describe("pingIndexNow", () => {
  it("posts the documented body shape to the IndexNow endpoint", async () => {
    const fetchImpl: FetchLike = vi.fn(async () => ({ status: 200 }));
    await pingIndexNow(URLS, KEY, HOST, { fetchImpl });
    const mock = fetchImpl as unknown as ReturnType<typeof vi.fn>;
    expect(mock).toHaveBeenCalledOnce();
    const call = mock.mock.calls[0] as [string, { method: string; headers: Record<string, string>; body: string }];
    const [url, init] = call;
    expect(url).toBe("https://api.indexnow.org/IndexNow");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toContain("application/json");
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: URLS,
    });
  });

  it("treats 200 as success", async () => {
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl: fetchReturning(200) });
    expect(r.ok).toBe(true);
    expect(r.status).toBe(200);
    expect(r.submitted).toBe(URLS.length);
  });

  it("treats 202 as success (accepted, key pending validation)", async () => {
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl: fetchReturning(202) });
    expect(r.ok).toBe(true);
    expect(r.status).toBe(202);
    expect(r.submitted).toBe(URLS.length);
  });

  it("treats 400 as failure (bad request)", async () => {
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl: fetchReturning(400) });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(400);
    expect(r.submitted).toBe(0);
  });

  it("treats 403 as failure (forbidden — key file invalid)", async () => {
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl: fetchReturning(403) });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(403);
    expect(r.message).toMatch(/forbidden/i);
  });

  it("treats 422 as failure (URL/host or key-location mismatch)", async () => {
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl: fetchReturning(422) });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(422);
  });

  it("treats 429 as failure (rate limited)", async () => {
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl: fetchReturning(429) });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(429);
    expect(r.message).toMatch(/rate/i);
  });

  it("short-circuits on empty urls without calling fetch", async () => {
    const fetchImpl = vi.fn(async () => ({ status: 200 }));
    const r = await pingIndexNow([], KEY, HOST, { fetchImpl });
    expect(r.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("short-circuits on missing key without calling fetch", async () => {
    const fetchImpl = vi.fn(async () => ({ status: 200 }));
    const r = await pingIndexNow(URLS, "", HOST, { fetchImpl });
    expect(r.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns a structured failure when fetch throws", async () => {
    const fetchImpl: FetchLike = async () => {
      throw new Error("network down");
    };
    const r = await pingIndexNow(URLS, KEY, HOST, { fetchImpl });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(0);
    expect(r.message).toMatch(/network down/);
  });
});
