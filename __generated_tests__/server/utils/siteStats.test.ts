// ============================================
// 🧪 TS 自動產生的測試 — by TestForge
// 來源：siteStats.ts
// 產生時間：2026-10-07T15:49:58.809Z
// ============================================
import { describe, it, expect, vi } from 'vitest';
import { emptyStatsPayload, readStatsCache, writeStatsCache, queryStats, refreshStatsCache } from '../../../server/utils/siteStats';

// 測試 emptyStatsPayload
describe('emptyStatsPayload', () => {
  it('應該是一個函數', () => {
    expect(typeof emptyStatsPayload).toBe('function');
  });
  it('預期接收 1 個必填參數 (Function.length)', () => {
    expect(emptyStatsPayload.length).toBe(1);
  });

  it('正常呼叫不應拋出錯誤', () => {
    expect(() => emptyStatsPayload(true)).not.toThrow();
  });

  it('應該有回傳值', () => {
    const result = emptyStatsPayload(true);
    expect(result).toBeDefined();
  });

  it('回傳值應與快照一致（偵測非預期變更）', () => {
    const result = emptyStatsPayload(true);
    expect(result).toMatchSnapshot();
  });

  // --- 邊界值測試 ---
  it('configured 為 false 時不應崩潰', () => {
    expect(() => emptyStatsPayload(false)).not.toThrow();
  });
  it('configured 傳入錯誤型別 (字串) 時的容錯處理', () => {
    try {
      emptyStatsPayload("not-a-boolean" as any);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('未提供任何參數呼叫時的容錯處理（缺少必填）', () => {
    try {
      (emptyStatsPayload as any)();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

// 測試 readStatsCache
describe('readStatsCache', () => {
  it('應該是一個函數', () => {
    expect(typeof readStatsCache).toBe('function');
  });
  it('預期接收 1 個必填參數 (Function.length)', () => {
    expect(readStatsCache.length).toBe(1);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = readStatsCache({ id: "1" });
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});

// 測試 writeStatsCache
describe('writeStatsCache', () => {
  it('應該是一個函數', () => {
    expect(typeof writeStatsCache).toBe('function');
  });
  it('預期接收 2 個必填參數 (Function.length)', () => {
    expect(writeStatsCache.length).toBe(2);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = writeStatsCache({ id: "1" }, { id: "1" });
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});

// 測試 queryStats
describe('queryStats', () => {
  it('應該是一個函數', () => {
    expect(typeof queryStats).toBe('function');
  });
  it('預期接收 1 個必填參數 (Function.length)', () => {
    expect(queryStats.length).toBe(1);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = queryStats({ id: "1" });
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});

// 測試 refreshStatsCache
describe('refreshStatsCache', () => {
  it('應該是一個函數', () => {
    expect(typeof refreshStatsCache).toBe('function');
  });
  it('預期接收 2 個必填參數 (Function.length)', () => {
    expect(refreshStatsCache.length).toBe(2);
  });

  it('呼叫時應回傳 Promise', () => {
    const result = refreshStatsCache({ id: "1" }, { id: "1" });
    expect(result).toBeInstanceOf(Promise);
    result.catch(() => {});
  });
});
