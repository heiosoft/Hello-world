import { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { authStorage } from '../auth';
import { useAuth } from '../authContext';
import type { User } from '../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('dean@example.com');
  const [password, setPassword] = useState('abc12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(email)) return setError('請輸入正確 Email 格式');
    if (!passwordRegex.test(password)) return setError('密碼需至少 8 碼且包含英文字母與數字');

    setLoading(true);
    setError('');
    try {
      const response = await api.post<{ accessToken: string; user: User }>('/login', { email, password });
      authStorage.setToken(response.data.accessToken);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const apiError = err as AxiosError<{ message?: string }>;
      setError(apiError.response?.data?.message ?? '登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>登入</h1>
      {location.state?.expired && <p className="error">登入已過期，請重新登入</p>}
      <form onSubmit={onSubmit} className="form">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button disabled={loading}>{loading ? '登入中...' : '登入'}</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
