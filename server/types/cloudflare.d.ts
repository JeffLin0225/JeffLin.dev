/**
 * Cloudflare Bindings TypeScript 型別定義
 * 為 event.context.cloudflare.env 提供自動補全
 */
declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      env: {
        /** Cloudflare KV — 主要鍵值對儲存 */
        KV: KVNamespace
        // 未來擴充：
        // MY_BUCKET: R2Bucket
        // AI: Ai
      }
    }
  }
}

export {}
