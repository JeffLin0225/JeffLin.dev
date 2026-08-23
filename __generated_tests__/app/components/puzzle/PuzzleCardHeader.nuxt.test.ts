// ============================================
// 🟢 自動產生的 Nuxt 元件測試 — by TestForge
// 來源：PuzzleCardHeader.vue
// 產生時間：2026-08-23T15:38:57.932Z
// ============================================
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PuzzleCardHeader from '../../../../app/components/puzzle/PuzzleCardHeader.vue';


// ============================================
// 🟢 Nuxt 專屬 Mocks (模擬 Auto-imports)
import { vi } from 'vitest';
vi.stubGlobal('useRoute', () => ({ path: '/', query: {}, params: {} }));
vi.stubGlobal('useRouter', () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() }));
vi.stubGlobal('navigateTo', vi.fn());
vi.stubGlobal('useFetch', () => ({ data: { value: null }, pending: { value: false }, error: { value: null }, execute: vi.fn() }));
vi.stubGlobal('useAsyncData', () => ({ data: { value: null }, pending: { value: false }, error: { value: null }, execute: vi.fn() }));
vi.stubGlobal('useRuntimeConfig', () => ({ public: {} }));
vi.stubGlobal('definePageMeta', vi.fn());
// ============================================

// Mock Props 資料
const defaultProps = {
    'filename': 'Test Value'
};

// 輔助函數：快速掛載元件
function mountComponent(overrideProps = {}) {
  return mount(PuzzleCardHeader, {
    props: { ...defaultProps, ...overrideProps },
  });
}

describe('PuzzleCardHeader.vue', () => {
  // ===== 基本掛載 =====
  it('應該能正常掛載', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('掛載後不應有 console 錯誤', () => {
    expect(() => mountComponent()).not.toThrow();
  });

  // ===== Props 渲染 =====
  it('應該渲染 prop: filename', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain(String(defaultProps.filename));
  });

  // ===== 快照測試 =====
  it('渲染結果應與快照一致', () => {
    const wrapper = mountComponent();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
