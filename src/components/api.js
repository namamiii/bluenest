const BASE_URL = "https://team3backend.onrender.com";
export function refreshAccessToken(refreshToken) {
  return fetch(`${BASE_URL}/api/accounts/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
async function authorizedFetch(url, options = {}) {
  let accessToken = localStorage.getItem("access");
  if (!accessToken) {
    throw new Error("Please log in to continue.");
  }
  const sendRequest = (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
  let response = await sendRequest(accessToken);
  if (response.status !== 401) {
    return response;
  }
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) {
    throw new Error("Session expired. Please log in again.");
  }
  const refreshResponse = await refreshAccessToken(refreshToken);
  if (!refreshResponse.access) {
    throw new Error("Could not refresh session. Please log in again.");
  }
  accessToken = refreshResponse.access;
  localStorage.setItem("access", accessToken);
  response = await sendRequest(accessToken);
  if (response.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }
  return response;
}
export function loginUser(username, password) {
  return fetch(`${BASE_URL}/api/accounts/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export function registerUser(userData) {
  return fetch(`${BASE_URL}/api/accounts/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export function createProperty(propertyData, token) {
  return authorizedFetch(
    `${BASE_URL}/api/listing/properties/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    }
  ).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export function getProperties(token) {
  return authorizedFetch(
    `${BASE_URL}/api/listing/properties/`,
    {
      method: "GET",
    }
  ).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export function updateProperty(propertyId, propertyData, token) {
  return authorizedFetch(
    `${BASE_URL}/api/listing/properties/${propertyId}/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    }
  ).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export function deleteProperty(propertyId, token) {
  return authorizedFetch(
    `${BASE_URL}/api/listing/properties/${propertyId}/delete/`,
    {
      method: "DELETE",
    }
  ).then(async (response) => {
    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  });
}
export function uploadPropertyImage(propertyId, imageFile, token) {
  const formData = new FormData();
  formData.append("image", imageFile);
  return authorizedFetch(
    `${BASE_URL}/api/listing/properties/${propertyId}/upload-image/`,
    {
      method: "POST",
      body: formData,
    }
  ).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export function logoutUser(refreshToken, accessToken) {
  return fetch(`${BASE_URL}/api/accounts/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data.detail || data.message || JSON.stringify(data)
      );
    }
    return data;
  });
}
export async function getBookings() {
  const response = await authorizedFetch(
    `${BASE_URL}/api/booking/`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "Unable to load bookings."
    );
  }
  return data;
}
