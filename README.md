# Vite + React + TypeScript Auth Demo

包含：登入流程、JWT token（localStorage）、Protected Route、RBAC、MSW mock server、axios API。

## 安裝
```bash
npm install
```

## 啟動（dev + MSW）
```bash
cp .env.example .env
npm run dev
```
> 需設定 `VITE_USE_MSW=true` 才會在 `src/main.tsx` 啟用 MSW。

## 測試
```bash
npm run test
```

## 手動測試流程清單
1. **success**
   - 面板情境選 `login:success`。
   - `/login` 輸入合法帳密後登入，應導向 `/dashboard` 並顯示歡迎與商品。
2. **401（登入失敗）**
   - 面板切 `login:invalid_password` 或 `login:email_not_found`。
   - 驗證錯誤訊息為中文。
3. **403 / 權限不足（RBAC）**
   - 用一般 user 登入（email 不含 admin）。
   - 手動前往 `/admin`，應被導回 `/dashboard`。
4. **expired**
   - 先登入成功，再把情境切成 `me:token_expired`。
   - 重整 `/dashboard`，應清 token、導回 `/login` 且顯示過期訊息。
5. **delay / loading**
   - 面板延遲切為 `500` 或 `1000`。
   - 重新觸發登入或進 dashboard，觀察 loading 畫面。
6. **500 + retry**
   - `me:server_error` 或 `products:server_error`，應顯示錯誤。
   - 切回 success 後重整重試。

## Dev 手動測試面板
右下角浮窗（僅 dev）：
- 切換 API 情境（login/me/products）
- 切換延遲 0 / 0.5s / 1s
- 一鍵清除 token

MSW handler 會從 localStorage 讀取：
- `msw_scenario`
- `msw_delay`
