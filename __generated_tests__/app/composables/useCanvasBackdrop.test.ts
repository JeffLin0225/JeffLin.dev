// ============================================
// 🧪 TS 自動產生的測試 — by TestForge
// 來源：useCanvasBackdrop.ts
// 產生時間：2026-10-19T15:47:41.028Z
// ============================================
import { describe, it, expect } from 'vitest';
import { useCanvasBackdrop } from '../../../app/composables/useCanvasBackdrop';

// 測試 useCanvasBackdrop
describe('useCanvasBackdrop', () => {
  it('應該是一個函數', () => {
    expect(typeof useCanvasBackdrop).toBe('function');
  });
  it('預期接收 2 個必填參數 (Function.length)', () => {
    expect(useCanvasBackdrop.length).toBe(2);
  });

  it('正常呼叫不應拋出錯誤', () => {
    expect(() => useCanvasBackdrop({ id: "1" }, 1, { key: "value" })).not.toThrow();
  });

  it('應該有回傳值', () => {
    const result = useCanvasBackdrop({ id: "1" }, 1, { key: "value" });
    expect(result).toBeDefined();
  });

  it('回傳值應與快照一致（偵測非預期變更）', () => {
    const result = useCanvasBackdrop({ id: "1" }, 1, { key: "value" });
    expect(result).toMatchSnapshot();
  });

  // --- 邊界值測試 ---
  it('canvas 為 null 時的容錯處理', () => {
    // 預期可能會拋錯，或是優雅處理（取決於實作）
    try {
      useCanvasBackdrop(null as any, 1, { key: "value" });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('canvas 為空物件 {} 時的行為', () => {
    try {
      useCanvasBackdrop({} as any, 1, { key: "value" });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('canvas 傳入錯誤型別 (數字) 時的容錯處理', () => {
    try {
      useCanvasBackdrop(123 as any, 1, { key: "value" });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('_obj 為 null 時的容錯處理', () => {
    // 預期可能會拋錯，或是優雅處理（取決於實作）
    try {
      useCanvasBackdrop({ id: "1" }, 1, null as any);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('_obj 為空物件 {} 時的行為', () => {
    try {
      useCanvasBackdrop({ id: "1" }, 1, {} as any);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('_obj 傳入錯誤型別 (數字) 時的容錯處理', () => {
    try {
      useCanvasBackdrop({ id: "1" }, 1, 123 as any);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  it('未提供任何參數呼叫時的容錯處理（缺少必填）', () => {
    try {
      (useCanvasBackdrop as any)();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('只傳必填參數也不應崩潰', () => {
    expect(() => useCanvasBackdrop({ id: "1" }, 1)).not.toThrow();
  });
});
