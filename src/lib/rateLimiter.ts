interface RateLimitEntry {
  tokens: number;
  lastRefillTimestamp: number;
}

class TokenBucketRateLimiter {
  private bucketCapacity: number;
  private tokensPerMinute: number;
  private store: Map<string, RateLimitEntry>;
  private cleanupInterval: NodeJS.Timeout;

  constructor(options: { bucketCapacity: number; tokensPerMinute: number }) {
    this.bucketCapacity = options.bucketCapacity;
    this.tokensPerMinute = options.tokensPerMinute;
    this.store = new Map();

    // Clean up old entries every 5 minutes to prevent memory leaks
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000,
    );
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastRefillTimestamp > maxAge) {
        this.store.delete(key);
      }
    }
  }

  async allow(key: string, tokensToConsume: number = 1): Promise<boolean> {
    const now = Date.now();
    const refillRate = this.tokensPerMinute / 60000;

    const entry = this.store.get(key) || {
      tokens: this.bucketCapacity,
      lastRefillTimestamp: now,
    };

    // Refill the bucket
    const timePassed = now - entry.lastRefillTimestamp;
    const tokensToAdd = timePassed * refillRate;
    const newTokens = Math.min(this.bucketCapacity, entry.tokens + tokensToAdd);

    // Check if there are enough tokens to consume
    if (newTokens >= tokensToConsume) {
      const remainingTokens = newTokens - tokensToConsume;

      // Update tokens and timestamp
      this.store.set(key, {
        tokens: remainingTokens,
        lastRefillTimestamp: now,
      });

      return true; // Allow the request
    }

    return false; // Rate limit the request
  }

  // Method to clean up resources when the application shuts down
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

export { TokenBucketRateLimiter };
