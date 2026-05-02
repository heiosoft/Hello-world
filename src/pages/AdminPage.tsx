import { useAuth } from '../authContext';

export const AdminPage = () => {
  const { user } = useAuth();
  return (
    <div className="card">
      <h1>Admin 控制台</h1>
      <p>目前角色：{user?.role}</p>
      <p>你擁有管理者權限，可檢視此頁內容。</p>
    </div>
  );
};
