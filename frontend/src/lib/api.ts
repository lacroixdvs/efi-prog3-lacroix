const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  const headers: any = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}