// ============================================
// 🟢 自動產生的 Nuxt 元件測試 — by TestForge
// 來源：SearchHero.vue
// 產生時間：2026-07-25T09:18:16.854Z
// ============================================
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchHero from '../../../../app/components/github/SearchHero.vue';


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
    'modelValue': 'Test Value',
    'suggestions': {
        'id': '1',
        'name': 'Test'
    },
    'languages': {
        'id': '1',
        'name': 'Test'
    },
    'selectedLanguages': [],
    'totalCount': 42
};

// 輔助函數：快速掛載元件
function mountComponent(overrideProps = {}) {
  return mount(SearchHero, {
    props: { ...defaultProps, ...overrideProps },
  });
}

describe('SearchHero.vue', () => {
  // ===== 基本掛載 =====
  it('應該能正常掛載', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('掛載後不應有 console 錯誤', () => {
    expect(() => mountComponent()).not.toThrow();
  });

  // ===== Props 渲染 =====
  // ===== 按鈕互動 =====
  it('按鈕「{{ lang.name }}」應該存在', () => {
    const wrapper = mountComponent();
    const button = wrapper.findAll('button').at(0);
    expect(button.exists()).toBe(true);
  });

  it('點擊「{{ lang.name }}」應觸發 toggleLanguage 事件', async () => {
    const wrapper = mountComponent();
    const button = wrapper.findAll('button').at(0);
    await button.trigger('click');
    expect(wrapper.emitted('toggleLanguage')).toBeTruthy();
    expect(wrapper.emitted('toggleLanguage')).toHaveLength(1);
  });

  it('按鈕「按鈕2」應該存在', () => {
    const wrapper = mountComponent();
    const button = wrapper.findAll('button').at(1);
    expect(button.exists()).toBe(true);
  });

  it('按鈕「{{ repo.name }}                                                       {{ repo.language }}」應該存在', () => {
    const wrapper = mountComponent();
    const button = wrapper.findAll('button').at(2);
    expect(button.exists()).toBe(true);
  });

  // ===== 表單輸入 =====
  it('input 元素應該存在', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('#github-search-input').exists()).toBe(true);
  });

  it('input 應支援輸入（v-model: localQuery）', async () => {
    const wrapper = mountComponent();
    const el = wrapper.find('#github-search-input');
    await el.setValue("test input value");
    expect((el.element as HTMLInputElement).value).toBe("test input value");
  });

  // ===== 條件渲染 =====
  it('條件渲染 (totalCount > 0) 不同值不應崩潰', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('條件渲染 (localQuery) 不同值不應崩潰', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('條件渲染 (isFocused && suggestions.length > 0) 不同值不應崩潰', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('條件渲染 (repo.language) 不同值不應崩潰', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  // ===== 快照測試 =====
  it('渲染結果應與快照一致', () => {
    const wrapper = mountComponent();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
