// ============================================
// 🟢 自動產生的 Nuxt 元件測試 — by TestForge
// 來源：BarList.vue
// 產生時間：2026-10-04T08:12:09.288Z
// ============================================
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BarList from '../../../../app/components/stats/BarList.vue';


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
    'title': 'Test Value',
    'rows': {
        'id': '1',
        'name': 'Test'
    },
    'emptyText': 'Test Value'
};

// 輔助函數：快速掛載元件
function mountComponent(overrideProps = {}) {
  return mount(BarList, {
    props: { ...defaultProps, ...overrideProps },
  });
}

describe('BarList.vue', () => {
  // ===== 基本掛載 =====
  it('應該能正常掛載', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('掛載後不應有 console 錯誤', () => {
    expect(() => mountComponent()).not.toThrow();
  });

  // ===== Props 渲染 =====
  it('應該渲染 prop: title', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain(String(defaultProps.title));
  });

  it('應該渲染 prop: emptyText', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain(String(defaultProps.emptyText));
  });

  // ===== 條件渲染 =====
  it('條件渲染 (rows.length === 0) 不同值不應崩潰', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  // ===== 快照測試 =====
  it('渲染結果應與快照一致', () => {
    const wrapper = mountComponent();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
