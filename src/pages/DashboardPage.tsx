import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { authStorage } from '../auth';
import { useAuth } from '../authContext';
import type { Product, User } from '../types';

export const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await api.get<User>('/me');
        setUser(me.data);
        const res = await api.get<{ products: Product[] }>('/products');
        setProducts(res.data.products.slice(0, 3));
      } catch (err) {
        const apiError = err as AxiosError<{ message?: string }>;
        if (apiError.response?.status === 401) {
          authStorage.clearToken();
          navigate('/login', { state: { expired: true } });
          return;
        }
        setError(apiError.response?.data?.message ?? '讀取失敗');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, setUser]);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h1>Welcome, {user?.username ?? 'user'}</h1>
      <h2>商品列表</h2>
      {error && <p className="error">{error}</p>}
      <div className="products">
        {products.map((p) => (
          <article key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>${p.price}</strong>
          </article>
        ))}
      </div>
    </div>
  );
};
