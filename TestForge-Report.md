# 🔧 TestForge 測試報告

![Tests](https://img.shields.io/badge/Tests-52_Passed,_47_Failed-red)
![Coverage](https://img.shields.io/badge/Coverage-0%25-red)
![Threshold](https://img.shields.io/badge/Threshold-80%25-red)

> 📅 報告產生時間：2026/7/25 下午5:18:47
> 🔧 由 [TestForge](https://github.com/JeffLin0225/testforge) 自動產生

---

## 📋 測試總覽

| 指標 | 數值 |
| --- | --- |
| 測試檔案數 | 23 |
| 總測試數 | 99 |
| ✅ 通過 | 52 |
| ❌ 失敗 | 47 |
| 通過率 | 52.5% |

## 📄 測試檔案結果

| 檔案名稱 | 狀態 | 通過 | 失敗 | 總數 |
| --- | --- | --- | --- | --- |
| `app.nuxt.test.ts` | ✅ | 3 | 0 | 3 |
| `error.nuxt.test.ts` | ❌ | 0 | 5 | 5 |
| `AppFooter.nuxt.test.ts` | ✅ | 3 | 0 | 3 |
| `AppNavbar.nuxt.test.ts` | ❌ | 0 | 6 | 6 |
| `useGithubRepos.test.ts` | ❌ | 2 | 3 | 5 |
| `useLanguageColors.test.ts` | ✅ | 5 | 0 | 5 |
| `default.nuxt.test.ts` | ✅ | 3 | 0 | 3 |
| `about.nuxt.test.ts` | ❌ | 0 | 3 | 3 |
| `contact.nuxt.test.ts` | ❌ | 0 | 3 | 3 |
| `index.nuxt.test.ts` | ❌ | 0 | 3 | 3 |
| `github.test.ts` | ✅ | 3 | 0 | 3 |
| `useKV.test.ts` | ✅ | 9 | 0 | 9 |
| `EmptyState.nuxt.test.ts` | ✅ | 4 | 0 | 4 |
| `RepoCard.nuxt.test.ts` | ❌ | 0 | 5 | 5 |
| `RepoGrid.nuxt.test.ts` | ✅ | 6 | 0 | 6 |
| `SearchHero.nuxt.test.ts` | ❌ | 0 | 13 | 13 |
| `HeroSection.nuxt.test.ts` | ❌ | 0 | 3 | 3 |
| `NavigationCards.nuxt.test.ts` | ✅ | 3 | 0 | 3 |
| `PuzzleCardFooter.nuxt.test.ts` | ✅ | 3 | 0 | 3 |
| `PuzzleCardHeader.nuxt.test.ts` | ✅ | 4 | 0 | 4 |
| `LoadingOverlay.nuxt.test.ts` | ❌ | 0 | 0 | 0 |
| `index.nuxt.test.ts` | ❌ | 0 | 3 | 3 |
| `index.nuxt.test.ts` | ✅ | 4 | 0 | 4 |

## ❌ 失敗的測試

### `error.nuxt.test.ts`

- **error.vue 應該能正常掛載**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/error.vue:41:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **error.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: computed is not defin…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/error.nuxt.test.ts:46:40
  ```
- **error.vue 按鈕「← Back to Home」應該存在**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/error.vue:41:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **error.vue 點擊「← Back to Home」不應崩潰**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/error.vue:41:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **error.vue 渲染結果應與快照一致**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/error.vue:41:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `AppNavbar.nuxt.test.ts`

- **AppNavbar.vue 應該能正常掛載**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/AppNavbar.vue:99:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **AppNavbar.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: ref is not defined' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/components/AppNavbar.nuxt.test.ts:41:40
  ```
- **AppNavbar.vue 按鈕「按鈕1」應該存在**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/AppNavbar.vue:99:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **AppNavbar.vue 點擊「按鈕1」不應崩潰**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/AppNavbar.vue:99:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **AppNavbar.vue 條件渲染 (mobileOpen) 不同值不應崩潰**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/AppNavbar.vue:99:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **AppNavbar.vue 渲染結果應與快照一致**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/AppNavbar.vue:99:20)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `useGithubRepos.test.ts`

- **useGithubRepos 正常呼叫不應拋出錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: useState is not defin…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/composables/useGithubRepos.test.ts:19:40
  ```
- **useGithubRepos 應該有回傳值**
  ```
  ReferenceError: useState is not defined
      at useGithubRepos (/home/runner/work/JeffLin.dev/JeffLin.dev/app/composables/useGithubRepos.ts:10:17)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/composables/useGithubRepos.test.ts:23:20
      at file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
      at file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/runner/dist/chunk-artifact.js:1903:26
  ```
- **useGithubRepos 回傳值應與快照一致（偵測非預期變更）**
  ```
  ReferenceError: useState is not defined
      at useGithubRepos (/home/runner/work/JeffLin.dev/JeffLin.dev/app/composables/useGithubRepos.ts:10:17)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/composables/useGithubRepos.test.ts:28:20
      at file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
      at file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/runner/dist/chunk-artifact.js:1903:26
  ```

### `about.nuxt.test.ts`

- **about.vue 應該能正常掛載**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/about.vue:11:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **about.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: useSeoMeta is not def…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/pages/about.nuxt.test.ts:41:40
  ```
- **about.vue 渲染結果應與快照一致**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/about.vue:11:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `contact.nuxt.test.ts`

- **contact.vue 應該能正常掛載**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/contact.vue:11:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **contact.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: useSeoMeta is not def…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/pages/contact.nuxt.test.ts:41:40
  ```
- **contact.vue 渲染結果應與快照一致**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/contact.vue:11:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `index.nuxt.test.ts`

- **index.vue 應該能正常掛載**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/index.vue:8:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **index.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: useSeoMeta is not def…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/pages/index.nuxt.test.ts:41:40
  ```
- **index.vue 渲染結果應與快照一致**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/index.vue:8:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `RepoCard.nuxt.test.ts`

- **RepoCard.vue 應該能正常掛載**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/RepoCard.vue:56:23)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **RepoCard.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: computed is not defin…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/components/github/RepoCard.nuxt.test.ts:47:40
  ```
- **RepoCard.vue 應該渲染 repo.name**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/RepoCard.vue:56:23)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **RepoCard.vue 條件渲染 (repo.language) 不同值不應崩潰**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/RepoCard.vue:56:23)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **RepoCard.vue 渲染結果應與快照一致**
  ```
  ReferenceError: computed is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/RepoCard.vue:56:23)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `SearchHero.nuxt.test.ts`

- **SearchHero.vue 應該能正常掛載**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: ref is not defined' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/components/github/SearchHero.nuxt.test.ts:53:40
  ```
- **SearchHero.vue 按鈕「{{ lang.name }}」應該存在**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 點擊「{{ lang.name }}」應觸發 toggleLanguage 事件**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 按鈕「按鈕2」應該存在**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 按鈕「{{ repo.name }}                                                       {{ repo.language }}」應該存在**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue input 元素應該存在**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue input 應支援輸入（v-model: localQuery）**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 條件渲染 (totalCount > 0) 不同值不應崩潰**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 條件渲染 (localQuery) 不同值不應崩潰**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 條件渲染 (isFocused && suggestions.length > 0) 不同值不應崩潰**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 條件渲染 (repo.language) 不同值不應崩潰**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **SearchHero.vue 渲染結果應與快照一致**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/github/SearchHero.vue:132:19)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `HeroSection.nuxt.test.ts`

- **HeroSection.vue 應該能正常掛載**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/home/HeroSection.vue:98:23)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **HeroSection.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: ref is not defined' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/components/home/HeroSection.nuxt.test.ts:41:40
  ```
- **HeroSection.vue 渲染結果應與快照一致**
  ```
  ReferenceError: ref is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/components/home/HeroSection.vue:98:23)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

### `index.nuxt.test.ts`

- **index.vue 應該能正常掛載**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/craditCard/index.vue:194:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```
- **index.vue 掛載後不應有 console 錯誤**
  ```
  AssertionError: expected [Function] to not throw an error but 'ReferenceError: useSeoMeta is not def…' was thrown
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1552:16)
      at Proxy.<anonymous> (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vitest/expect/dist/index.js:1156:15)
      at Proxy.methodWrapper (file:///home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/chai/index.js:1700:25)
      at /home/runner/work/JeffLin.dev/JeffLin.dev/__generated_tests__/app/pages/craditCard/index.nuxt.test.ts:41:40
  ```
- **index.vue 渲染結果應與快照一致**
  ```
  ReferenceError: useSeoMeta is not defined
      at setup (/home/runner/work/JeffLin.dev/JeffLin.dev/app/pages/craditCard/index.vue:194:1)
      at callWithErrorHandling (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:200:19)
      at setupStatefulComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8078:25)
      at setupComponent (/home/runner/work/JeffLin.dev/JeffLin.dev/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:8040:36)
  ```

---

> 💡 如果想看詳細的互動式覆蓋率報告，請查看 `coverage/index.html`。
>
> 🔧 此報告由 [TestForge](https://github.com/JeffLin0225/testforge) 自動產生。
