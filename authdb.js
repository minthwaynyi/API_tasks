let authUsers = [
  {
    "username": "dylan",
    "password": "sala",
    rateLimiting: { window: 0, requestCounter: 0}
  },
];

export const getAuthUser = (username) => {
  return authUsers.find((u) => u.username === username);
};

export const userNameExists = (username) => {
  return !!authUsers.find((u) => u.username === username);
};
