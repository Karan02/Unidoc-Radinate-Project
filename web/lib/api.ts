// utils/api.ts
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`http://localhost:3001${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ API error [${endpoint}]:`, error);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
