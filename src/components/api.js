export function loginUser(username, password) {
  return fetch("http://127.0.0.1:8000/api/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }).then((response) => response.json());
}

