export function loginUser(username, password) {
  return fetch("https://teamblue.onrender.com/api/accounts/login/", {
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
  return fetch("https://teamblue.onrender.com/api/accounts/register/", {
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
  return fetch(
    "https://teamblue.onrender.com/api/listing/properties/create/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  return fetch(
    "https://teamblue.onrender.com/api/listing/properties/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  return fetch(
    `https://teamblue.onrender.com/api/listing/properties/${propertyId}/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  return fetch(
    `https://teamblue.onrender.com/api/listing/properties/${propertyId}/delete/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  return fetch(
    `https://teamblue.onrender.com/api/listing/properties/${propertyId}/upload-image/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

