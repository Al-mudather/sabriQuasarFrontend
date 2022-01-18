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
    localStorage.clear();
    localStorage.removeItem("Frontend_user");
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
  }
};

const userProfileStorage = {
  setUser(user) {
    try {
      localStorage.setItem("Frontend_user", JSON.stringify(user));
    } catch (e) {
      // Pass Don't Set Any Thing
    }
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("Frontend_user"));
    } catch (e) {
      return {}
    }
  },
  clearUserProfileStorage() {
    localStorage.removeItem("Frontend_user");
  }
};


export {tokenStorage, userProfileStorage};
