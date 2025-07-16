let accessToken = null;
let currentUser = null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAccessToken = () => {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
};

export const setUser = (userObj) => {
  currentUser = userObj;
  if (userObj) {
    localStorage.setItem('user', JSON.stringify(userObj));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  if (!currentUser) {
    const userStr = localStorage.getItem('user');
    currentUser = userStr ? JSON.parse(userStr) : null;
  }
  return currentUser;
};
