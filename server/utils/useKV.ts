import type { H3Event } from 'h3'

/**
 * KV Binding 工具函數
 * 封裝 Cloudflare KV 的存取，開發環境無 KV 時回傳 null
 */
export const useKV = (event: H3Event): KVNamespace | null => {
  try {
    const kv = event.context.cloudflare?.env?.KV
    return kv ?? null
  } catch {
    return null
  }
}
