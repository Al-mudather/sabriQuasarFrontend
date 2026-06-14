// Centralized client-side auth/session storage.
//
// Storage keys are namespaced under `dstc-frontend.` so they can't collide with
// generic keys from another app sharing the same origin (notably on a shared
// localhost dev port) and so every read unambiguously targets THIS app's
// session. The rename away from the old generic keys (userAccessToken /
// userRefreshToken / Frontend_user) also forces a clean re-login on deploy,
// dropping any stale token that was lingering under the old names.

const ACCESS_TOKEN_KEY = "dstc-frontend.accessToken";
const REFRESH_TOKEN_KEY = "dstc-frontend.refreshToken";
const USER_PROFILE_KEY = "dstc-frontend.user";

// Social-auth (Google/Facebook) provider token stashed by boot/hello.js under
// this sessionStorage key. Exported so boot/hello.js and the logout purge share
// one source of truth and the purge can clear it explicitly.
const SOCIAL_AUTH_KEY = "dstc-frontend.socialAuth";

const tokenStorage = {
  setToken(tokenObj) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, tokenObj.token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, tokenObj.refresh);
  },
  setAccessToken(accessToken) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setRefreshToken(refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },
  clearToken() {
    // Remove only the token keys. The full logout wipe (purgeClientStorage)
    // owns clearing everything else — clearToken is also called by loginAction
    // to drop a stale token before writing a fresh one, where a blanket
    // sessionStorage.clear() would be too aggressive.
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

const userProfileStorage = {
  setUser(user) {
    try {
      sessionStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    } catch (e) {
      // Pass Don't Set Any Thing
    }
  },
  getUser() {
    try {
      return JSON.parse(sessionStorage.getItem(USER_PROFILE_KEY));
    } catch (e) {
      return {}
    }
  },
  clearUserProfileStorage() {
    sessionStorage.removeItem(USER_PROFILE_KEY);
  }
};


// ---------------------------------------------------------------------------
// Full client-session purge — used by logout to guarantee a fresh session.
//
// Wipes:
//   - every known auth/session/social token explicitly (access, refresh, user
//     profile, social-auth provider token),
//   - ALL of sessionStorage (tokens, user profile, cart, social token),
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

  // 1. Explicitly drop every known auth/session/social token first — from BOTH
  //    storages — so the intent is documented and a future refactor to
  //    selective clearing can't silently strand one of them (e.g. the social
  //    provider token).
  try {
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_PROFILE_KEY, SOCIAL_AUTH_KEY].forEach((k) => {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    });
  } catch (e) { /* ignore */ }

  // 2. Nuke the rest of sessionStorage (cart, order, etc.) wholesale.
  try {
    sessionStorage.clear();
  } catch (e) { /* ignore */ }

  // 3. Nuke localStorage except the whitelisted display prefs.
  try {
    // Snapshot keys first — removing while iterating live storage is unsafe.
    Object.keys(localStorage).forEach((key) => {
      if (!keep.has(key)) localStorage.removeItem(key);
    });
  } catch (e) { /* ignore */ }

  // 4. Expire all JS-readable cookies.
  try {
    clearAllCookies();
  } catch (e) { /* ignore */ }
}


export { tokenStorage, userProfileStorage, purgeClientStorage, SOCIAL_AUTH_KEY };
