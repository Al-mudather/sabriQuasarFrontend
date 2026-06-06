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
    // Remove only the token keys. The full logout wipe (purgeClientStorage)
    // owns clearing everything else — clearToken is also called by loginAction
    // to drop a stale token before writing a fresh one, where a blanket
    // sessionStorage.clear() would be too aggressive.
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
    sessionStorage.removeItem("Frontend_user");
  }
};


// ---------------------------------------------------------------------------
// Full client-session purge — used by logout to guarantee a fresh session.
//
// Wipes:
//   - ALL of sessionStorage (tokens, user profile, cart),
//   - ALL of localStorage EXCEPT the keys in `keepLocalStorageKeys`
//     (we keep language + currency display prefs so logout doesn't flip the
//     UI language),
//   - ALL JS-readable cookies (e.g. csrftoken). httpOnly cookies cannot be
//     touched from JS — those are a backend/expiry concern.
// ---------------------------------------------------------------------------
function clearAllCookies() {
  if (typeof document === "undefined" || !document.cookie) return;
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  // Build the candidate domains: exact host, ".host", and the dot-parent
  // (e.g. "stc.training" → ".stc.training") so domain-scoped cookies die too.
  const domains = ["", host, "." + host];
  const parts = host.split(".");
  if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));

  const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie.split(";").forEach((raw) => {
    const name = raw.split("=")[0].trim();
    if (!name) return;
    // Expire across path "/" for every candidate domain (and no-domain).
    domains.forEach((domain) => {
      let cookie = `${name}=; expires=${pastDate}; path=/`;
      if (domain) cookie += `; domain=${domain}`;
      document.cookie = cookie;
    });
  });
}

function purgeClientStorage({ keepLocalStorageKeys = [] } = {}) {
  const keep = new Set(keepLocalStorageKeys);

  try {
    sessionStorage.clear();
  } catch (e) { /* ignore */ }

  try {
    // Snapshot keys first — removing while iterating live storage is unsafe.
    Object.keys(localStorage).forEach((key) => {
      if (!keep.has(key)) localStorage.removeItem(key);
    });
  } catch (e) { /* ignore */ }

  try {
    clearAllCookies();
  } catch (e) { /* ignore */ }
}


export { tokenStorage, userProfileStorage, purgeClientStorage };
