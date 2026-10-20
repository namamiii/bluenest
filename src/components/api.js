const BASE_URL = "https://backend2-0-qbls.onrender.com/";
async function readResponse(response) {
  const responseText = await response.text();
  if (!responseText) {
    if (!response.ok) {
      throw new Error(`Request failed (HTTP ${response.status}).`);
    }
    return null;
  }
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Server returned an invalid response (HTTP ${response.status}).`
    );
  }
  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      data.error ||
      JSON.stringify(data)
    );
  }
  return data;
}
export async function refreshAccessToken(refreshToken) {
  const response = await fetch(
    `${BASE_URL}/api/accounts/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );
  return readResponse(response);
}
async function authorizedFetch(url, options = {}) {
  let accessToken = localStorage.getItem("access");
  if (!accessToken) {
    throw new Error("Please log in to continue.");
  }
  const sendRequest = (token) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  let response = await sendRequest(accessToken);
  if (response.status !== 401) {
    return response;
  }
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) {
    throw new Error("Session expired. Please log in again.");
  }
  const refreshedData = await refreshAccessToken(refreshToken);
  if (!refreshedData?.access) {
    throw new Error("Could not refresh session. Please log in again.");
  }
  accessToken = refreshedData.access;
  localStorage.setItem("access", accessToken);
  response = await sendRequest(accessToken);
  if (response.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }
  return response;
}
export async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/api/accounts/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return readResponse(response);
}
export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/api/accounts/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return readResponse(response);
}
export async function getProperties() {
  const response = await authorizedFetch(
    `${BASE_URL}/api/listing/properties/`
  );
  return readResponse(response);
}
export async function createProperty(propertyData) {
  const response = await authorizedFetch(
    `${BASE_URL}/api/listing/properties/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    }
  );
  return readResponse(response);
}
export async function updateProperty(propertyId, propertyData) {
  const response = await authorizedFetch(
    `${BASE_URL}/api/listing/properties/${propertyId}/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    }
  );
  return readResponse(response);
}
export async function deleteProperty(propertyId) {
  const response = await authorizedFetch(
    `${BASE_URL}/api/listing/properties/${propertyId}/delete/`,
    {
      method: "DELETE",
    }
  );
  return readResponse(response);
}
export async function uploadPropertyImage(propertyId, imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await authorizedFetch(
    `${BASE_URL}/api/listing/properties/${propertyId}/upload-image/`,
    {
      method: "POST",
      body: formData,
    }
  );
  return readResponse(response);
}
export async function getBookings() {
  const response = await authorizedFetch(
    `${BASE_URL}/api/booking/`
  );
  return readResponse(response);
}
export async function predictRent(propertyData) {
  const response = await authorizedFetch(
    `${BASE_URL}/api/ml/rent-prediction/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    }
  );
  return readResponse(response);
}
export async function checkListing(propertyData) {
  const response = await authorizedFetch(
    `${BASE_URL}/api/ml/check-listing/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    }
  );
  return readResponse(response);
}
export async function logoutUser(refreshToken, accessToken) {
  const response = await fetch(`${BASE_URL}/api/accounts/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  return readResponse(response);
}
export async function createBooking(bookingData) {
  const response = await authorizedFetch(
    `${BASE_URL}/api/booking/create/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    }
  );
  return readResponse(response);
}
export async function decideBooking(bookingId, status) {
  const token = localStorage.getItem("access");

  const response = await fetch(
    `${BASE_URL}/api/booking/${bookingId}/decision/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Unable to update booking status."
    );
  }
  return data;
}
