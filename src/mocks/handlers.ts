import { delay, http, HttpResponse } from 'msw';

const products = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `商品名稱 ${i + 1}`,
  price: (i + 1) * 100,
  description: `商品描述 ${i + 1}`
}));

const readScenario = (prefix: 'login' | 'me' | 'products') => {
  const raw = localStorage.getItem('msw_scenario') ?? `${prefix}:success`;
  return raw.startsWith(`${prefix}:`) ? raw.split(':')[1] : 'success';
};

const readDelay = () => Number(localStorage.getItem('msw_delay') ?? '0');

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    await delay(readDelay());
    const scenario = readScenario('login');
    const body = (await request.json()) as { email: string };
    if (scenario === 'invalid_password') return HttpResponse.json({ message: '密碼錯誤' }, { status: 401 });
    if (scenario === 'email_not_found') return HttpResponse.json({ message: '帳號不存在' }, { status: 401 });
    if (scenario === 'server_error') return HttpResponse.json({ message: '伺服器錯誤，請稍後再試' }, { status: 500 });
    return HttpResponse.json({ accessToken: 'fake.jwt.token', user: { username: 'dean', role: body.email.includes('admin') ? 'admin' : 'user' } });
  }),
  http.get('/api/me', async ({ request }) => {
    await delay(readDelay());
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: '未授權，請重新登入' }, { status: 401 });
    const scenario = readScenario('me');
    if (scenario === 'token_expired') return HttpResponse.json({ message: '登入已過期，請重新登入' }, { status: 401 });
    if (scenario === 'server_error') return HttpResponse.json({ message: '伺服器錯誤，請稍後再試' }, { status: 500 });
    return HttpResponse.json({ username: 'dean', role: auth.includes('admin') ? 'admin' : 'user' });
  }),
  http.get('/api/products', async ({ request }) => {
    await delay(readDelay());
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: '未授權，請重新登入' }, { status: 401 });
    const scenario = readScenario('products');
    if (scenario === 'token_expired') return HttpResponse.json({ message: '登入已過期，請重新登入' }, { status: 401 });
    if (scenario === 'server_error') return HttpResponse.json({ message: '伺服器錯誤，請稍後再試' }, { status: 500 });
    return HttpResponse.json({ products });
  })
];
