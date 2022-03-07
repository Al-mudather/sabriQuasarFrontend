const tokenStorage = {
  setToken(tokenObj) {
    sessionStorage.setItem("userAccessToken", tokenObj.token);
    sessionStorage.setItem("userRefreshToken", tokenObj.refresh);
  },
  setAccessToken(accessToken) {
    sessionStorage.setItem("userAccessToken", accessToken);
  },
  getAccessToken() {
    return sessionStorage.getItem("userAccessToken");
  },
  setRefreshToken(refreshToken) {
    sessionStorage.setItem("userRefreshToken", refreshToken);
  },
  getRefreshToken() {
    return sessionStorage.getItem("userRefreshToken");
  },
  clearToken() {
    sessionStorage.clear();
    sessionStorage.removeItem("Frontend_user");
    sessionStorage.removeItem("userAccessToken");
    sessionStorage.removeItem("userRefreshToken");
  }
};

const userProfileStorage = {
  setUser(user) {
    try {
      sessionStorage.setItem("Frontend_user", JSON.stringify(user));
    } catch (e) {
      // Pass Don't Set Any Thing
    }
  },
  getUser() {
    try {
      return JSON.parse(sessionStorage.getItem("Frontend_user"));
    } catch (e) {
      return {}
    }
  },
  clearUserProfileStorage() {
    sessionStorage.clear();
    sessionStorage.removeItem("Frontend_user");
  }
};


export {tokenStorage, userProfileStorage};
