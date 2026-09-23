const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response: Response) {
  // Safely parse the body — it may be JSON or plain text (e.g. rate-limit messages)
  const contentType = response.headers.get('content-type') ?? '';
  let data: unknown = null;
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    // Plain-text body (rate-limit, proxy errors, etc.) — read as text, don't JSON.parse
    const text = await response.text().catch(() => '');
    data = text || null;
  }

  if (!response.ok) {
    // Extract a human-readable message regardless of body format
    const message =
      (data && typeof data === 'object' && (data as Record<string, unknown>).message)
        ? String((data as Record<string, unknown>).message)
        : typeof data === 'string' && data.trim()
          ? data.trim()
          : response.statusText || `HTTP ${response.status}`;
    return Promise.reject(message);
  }

  return data;
}

export const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('uasa_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, body: any) => {
    const token = localStorage.getItem('uasa_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, body: any) => {
    const token = localStorage.getItem('uasa_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const token = localStorage.getItem('uasa_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(response);
  },
};
