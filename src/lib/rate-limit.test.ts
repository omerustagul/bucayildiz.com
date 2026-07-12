// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit, __resetRateLimit } from "@/lib/rate-limit";

beforeEach(() => __resetRateLimit());

describe("rateLimit", () => {
  it("limit'e kadar izin verir, sonra bloklar (retryAfter > 0)", () => {
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000).ok).toBe(true);
    const blocked = rateLimit("k", 3, 1000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("farklı anahtarlar bağımsız sayılır", () => {
    expect(rateLimit("a", 1, 1000).ok).toBe(true);
    expect(rateLimit("a", 1, 1000).ok).toBe(false);
    expect(rateLimit("b", 1, 1000).ok).toBe(true); // ayrı anahtar etkilenmez
  });

  it("pencere dolunca sayaç sıfırlanır", () => {
    vi.useFakeTimers();
    try {
      expect(rateLimit("k", 1, 1000).ok).toBe(true);
      expect(rateLimit("k", 1, 1000).ok).toBe(false);
      vi.advanceTimersByTime(1001);
      expect(rateLimit("k", 1, 1000).ok).toBe(true); // yeni pencere
    } finally {
      vi.useRealTimers();
    }
  });
});
