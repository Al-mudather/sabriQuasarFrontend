// Centralized client-side auth/session storage.
//
// Storage keys are namespaced under `dstc-frontend.` so they can't collide with
// generic keys from another app sharing the same origin (notably on a shared
// localhost dev port) and so every read unambiguously targets THIS app's
// session. The rename away from the old generic keys (userAccessToken /
// userRefreshToken / Frontend_user) also forces a clean re-login on deploy,
// dropping any stale token that was lingering under the old names.

import { HOST } from "../utils/hostConfig";

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
// Cookies we ALWAYS try to expire by name on logout — even if they're HttpOnly
// and therefore invisible to `document.cookie`. Attempting them by name is the
// only way to reach a cookie that never appears in `document.cookie`.
//   - sessionid / csrftoken : Django session + CSRF.
//   - REFRESH_TOKEN / ACCESS_TOKEN : django-graphql-jwt long-running token
//     cookies set by the BACKEND on the API domain. These are typically
//     HttpOnly, so this only helps when (a) they are NOT HttpOnly and (b) the
//     SPA is served same-site as the API (production). Otherwise only the
//     backend can expire them — see NOTE below.
const KNOWN_AUTH_COOKIES = ["sessionid", "csrftoken", "REFRESH_TOKEN", "ACCESS_TOKEN"];

// host, ".host", and every parent domain (".sub.example.com", ".example.com").
function hostDomainVariants(host) {
  const out = new Set();
  if (!host) return out;
  out.add(host);
  out.add("." + host);
  const parts = host.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    out.add("." + parts.slice(i).join("."));
  }
  return out;
}

// The backend API host (e.g. "stc.training") parsed from HOST, which may be a
// full URL ("https://stc.training") or a bare hostname.
function apiHostname() {
  try {
    const raw = String(HOST || "");
    if (!raw) return "";
    return new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`).hostname;
  } catch {
    return "";
  }
}

// NOTE / hard limit: JavaScript cannot delete an `HttpOnly` cookie — the
// browser silently ignores any `document.cookie` write to it. In a default
// Django setup `sessionid` IS HttpOnly, so if these cookies survive logout the
// definitive fix is a backend logout response (Set-Cookie expiry or
// `Clear-Site-Data`). Also, the browser only lets us write cookies for the
// CURRENT registrable domain — so on localhost dev we can't touch
// `.stc.training` cookies at all; this only reaches them when the SPA is served
// from the same site as the API (production). This function does the most JS is
// allowed to do: expire every JS-readable cookie PLUS the known auth cookies by
// name, across both the app host and the API host, every path, every flag combo.
function clearAllCookies() {
  if (typeof document === "undefined") return;
  const host = typeof window !== "undefined" ? window.location.hostname : "";

  // Target BOTH the app's own host AND the backend API host so the Django
  // session cookies are reached when the SPA is served from the same site.
  const domains = new Set([""]);
  hostDomainVariants(host).forEach((d) => domains.add(d));
  hostDomainVariants(apiHostname()).forEach((d) => domains.add(d));

  // Paths: root, plus every ancestor of the current path (e.g. "/", "/api",
  // "/api/v2") so cookies scoped to a sub-path are also expired.
  const paths = new Set(["/", ""]);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  let acc = "";
  pathname.split("/").filter(Boolean).forEach((seg) => {
    acc += "/" + seg;
    paths.add(acc);
  });

  const past = "Thu, 01 Jan 1970 00:00:00 GMT";
  const visible = (document.cookie || "")
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter(Boolean);
  // Union the visible cookies with the known auth cookies (which may be
  // HttpOnly and thus never appear above).
  const names = Array.from(new Set([...visible, ...KNOWN_AUTH_COOKIES]));

  names.forEach((name) => {
    paths.forEach((path) => {
      domains.forEach((domain) => {
        let base = `${name}=; expires=${past}; max-age=0`;
        if (path) base += `; path=${path}`;
        if (domain) base += `; domain=${domain}`;
        document.cookie = base;
        // Cover Secure + each SameSite mode so an https-set cookie is overwritten
        // regardless of how the server flagged it.
        document.cookie = base + "; secure; samesite=lax";
        document.cookie = base + "; secure; samesite=none";
      });
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
