const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// --- HELPERS DE COOKIES ---
export function setCookie(name: string, value: string, days = 1) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// --- GESTIÓN DE SESIÓN Y TOKENS EN COOKIES ---
export function saveAuthCookies(access: string, refresh: string, user: string, isAdmin: boolean) {
  setCookie("access", access, 1);
  if (refresh) setCookie("refresh", refresh, 7);
  setCookie("user", user, 7);
  setCookie("is_admin", String(isAdmin), 7);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }
}

export function clearAuthCookies() {
  deleteCookie("access");
  deleteCookie("refresh");
  deleteCookie("user");
  deleteCookie("is_admin");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }
}

export function getAccessToken(): string | null {
  const token = getCookie("access");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- CLIENTE FETCH CENTRALIZADO ---
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAuthCookies();
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) return null;
  return res.json();
}