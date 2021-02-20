const tokenStorage = {
  setToken(tokenObj) {
    localStorage.setItem("userAccessToken", tokenObj.token);
    localStorage.setItem("userRefreshToken", tokenObj.refresh);
  },
  setAccessToken(accessToken) {
    localStorage.setItem("userAccessToken", accessToken);
  },
  getAccessToken() {
    return localStorage.getItem("userAccessToken");
  },
  setRefreshToken(refreshToken) {
    localStorage.setItem("userRefreshToken", refreshToken);
  },
  getRefreshToken() {
    return localStorage.getItem("userRefreshToken");
  },
  clearToken() {
    localStorage.removeItem("user");
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
  }
};

const userProfileStorage = {
  setUser(user) {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      // Pass Don't Set Any Thing
    }
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return {}
    }
  },
  clearUserProfileStorage() {
    localStorage.removeItem("user");
  }
};


export {tokenStorage, userProfileStorage};
