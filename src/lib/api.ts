const API_BASE = "https://farmwise-api-cauf.onrender.com";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("fw_token") : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || err.error || `Request failed (${res.status})`);
  }

  return res.json();
}

// Auth
export const authApi = {
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    location?: string;
    cropTypes?: string[];
  }) => apiFetch<{ token: string; user: any }>("/api/v1/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ token: string; user: any }>("/api/v1/login", { method: "POST", body: JSON.stringify(data) }),
};

// Profile
export const profileApi = {
  get: () => apiFetch<{ user: any }>("/api/v1/me"),
  update: (data: any) => apiFetch<{ user: any }>("/api/v1/me", { method: "PUT", body: JSON.stringify(data) }),
  delete: () => apiFetch<any>("/api/v1/me", { method: "DELETE" }),
};

// AI
export const aiApi = {
  predict: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<any>("/predict", { method: "POST", body: formData });
  },
  chat: (question: string) =>
    apiFetch<{ response: string }>("/chat", { method: "POST", body: JSON.stringify({ question }) }),
};

// History
export const historyApi = {
  diagnoses: (limit = 20, offset = 0) =>
    apiFetch<{ diagnoses: any[] }>(`/api/v1/diagnoses?limit=${limit}&offset=${offset}`),
  chats: (limit = 20, offset = 0) =>
    apiFetch<{ chats: any[] }>(`/api/v1/chats?limit=${limit}&offset=${offset}`),
};

// Crops
export const cropsApi = {
  list: (search?: string) =>
    apiFetch<{ crops: any[] }>(`/api/v1/crops${search ? `?search=${encodeURIComponent(search)}` : ""}`),
};
