// ============================================
// 🧪 TS 自動產生的測試 — by TestForge
// 來源：github.ts
// 產生時間：2026-10-07T15:49:58.805Z
// ============================================
import { describe, it, expect, vi } from 'vitest';
import { fetchGitHubRepos, readReposCache, writeReposCache, refreshReposCache } from '../../../server/utils/github';

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

// 測試 readReposCache
describe('readReposCache', () => {
  it('應該是一個函數', () => {
    expect(typeof readReposCache).toBe('function');
  });
  it('預期接收 1 個必填參數 (Function.length)', () => {
    expect(readReposCache.length).toBe(1);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = readReposCache({ id: "1" });
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});

// 測試 writeReposCache
describe('writeReposCache', () => {
  it('應該是一個函數', () => {
    expect(typeof writeReposCache).toBe('function');
  });
  it('預期接收 3 個必填參數 (Function.length)', () => {
    expect(writeReposCache.length).toBe(3);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = writeReposCache({ id: "1" }, [{ id: "1" }], "test");
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});

// 測試 refreshReposCache
describe('refreshReposCache', () => {
  it('應該是一個函數', () => {
    expect(typeof refreshReposCache).toBe('function');
  });
  it('預期接收 2 個必填參數 (Function.length)', () => {
    expect(refreshReposCache.length).toBe(2);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = refreshReposCache({ id: "1" }, "test");
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});
