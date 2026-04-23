/**
 * Auth Cookie Template
 *
 * Reusable functions for managing authentication cookies.
 * Copy these into your auth utility file (e.g., src/lib/auth/cookies.ts)
 */

import { cookies } from "next/headers";

// Constants
const ACCESS_TOKEN = "ACCESS_TOKEN";
const IS_AUTHENTICATED = "is_authenticated";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Set authentication cookies after successful login
 * @param accessToken - JWT or session token from authentication
 */
export async function setAuthCookies(accessToken: string): Promise<void> {
  const cookieStore = await cookies();

  // Primary auth token (HTTP-only, secure)
  cookieStore.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true, // 🔒 CRITICAL - Prevents JavaScript access (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // 🔒 CRITICAL - CSRF protection
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Secondary status cookie (client-readable for UI state)
  cookieStore.set(IS_AUTHENTICATED, "true", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    // Note: NOT httpOnly - client can read this for UI state
  });
}

/**
 * Get authentication token from cookies
 * @returns Access token or undefined if not found
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN)?.value;
}

/**
 * Check if user is authenticated
 * @returns true if auth cookie exists
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get(ACCESS_TOKEN)?.value;
}

/**
 * Clear all authentication cookies (logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(IS_AUTHENTICATED);
}

/**
 * Refresh/update auth token cookie (e.g., after token refresh)
 * @param newAccessToken - New token to replace existing one
 */
export async function refreshAuthToken(newAccessToken: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN, newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
