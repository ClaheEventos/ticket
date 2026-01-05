const API_URL = "http://127.0.0.1:8000";

export async function apiFetch(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  // ✅ Todo OK
  if (response.status !== 401) {
    return response;
  }

  // ⛔ Token inválido → intentar refresh
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    logout();
    throw new Error("No refresh token");
  }

  const refreshResponse = await fetch(`${API_URL}/api/jefe/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!refreshResponse.ok) {
    logout();
    throw new Error("Refresh inválido");
  }

  const data = await refreshResponse.json();
  localStorage.setItem("accessToken", data.access);

  // 🔁 Reintentar request original
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.access}`,
    },
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
}
