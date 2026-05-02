export const getScenario = (prefix: 'login' | 'me' | 'products') => {
  const raw = localStorage.getItem('msw_scenario') ?? `${prefix}:success`;
  if (raw.startsWith(`${prefix}:`)) return raw.split(':')[1];
  return 'success';
};

export const getDelay = () => Number(localStorage.getItem('msw_delay') ?? '0');
