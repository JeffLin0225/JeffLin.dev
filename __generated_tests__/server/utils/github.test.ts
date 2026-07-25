// ============================================
// 🧪 TS 自動產生的測試 — by TestForge
// 來源：github.ts
// 產生時間：2026-07-25T09:18:16.900Z
// ============================================
import { describe, it, expect, vi } from 'vitest';
import { fetchGitHubRepos } from '../../../server/utils/github';

// 測試 fetchGitHubRepos
describe('fetchGitHubRepos', () => {
  it('應該是一個函數', () => {
    expect(typeof fetchGitHubRepos).toBe('function');
  });
  it('預期接收 1 個必填參數 (Function.length)', () => {
    expect(fetchGitHubRepos.length).toBe(1);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = fetchGitHubRepos("test");
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});
