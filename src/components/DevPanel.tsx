import { authStorage } from '../auth';

const scenarioKey = 'msw_scenario';
const delayKey = 'msw_delay';

const options = [
  'login:success',
  'login:invalid_password',
  'login:email_not_found',
  'login:server_error',
  'me:success',
  'me:token_expired',
  'me:server_error',
  'products:success',
  'products:server_error'
];

export const DevPanel = () => {
  if (!import.meta.env.DEV) return null;

  const update = (key: string, value: string) => {
    localStorage.setItem(key, value);
    window.location.reload();
  };

  return (
    <div className="dev-panel">
      <h4>MSW 測試面板</h4>
      <label>情境</label>
      <select defaultValue={localStorage.getItem(scenarioKey) ?? 'login:success'} onChange={(e) => update(scenarioKey, e.target.value)}>
        {options.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
      <label>延遲</label>
      <select defaultValue={localStorage.getItem(delayKey) ?? '0'} onChange={(e) => update(delayKey, e.target.value)}>
        <option value="0">0s</option>
        <option value="500">0.5s</option>
        <option value="1000">1s</option>
      </select>
      <button onClick={() => { authStorage.clearToken(); window.location.reload(); }}>清除 Token</button>
    </div>
  );
};
