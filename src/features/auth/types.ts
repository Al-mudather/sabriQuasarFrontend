/**
 * Auth feature — source of truth for authentication, registration, profile
 * and password operation types. Consumers (components, stores, composables)
 * MUST import from here, not from `src/graphql/generated`.
 *
 * This file contains only `export type` statements; it emits no runtime code.
 */

import type {
  // Queries
  GetMyProfileDataQuery,
  GetMyProfileDataQueryVariables,

  // Session / tokens
  LoginUserMutation,
  LoginUserMutationVariables,
  RefreshUserTokenMutation,
  RefreshUserTokenMutationVariables,
  RevokeUserRefreshTokenMutation,
  RevokeUserRefreshTokenMutationVariables,
  VerifyUserTokenMutation,
  VerifyUserTokenMutationVariables,

  // Registration / activation
  RegisterNewUserMutation,
  RegisterNewUserMutationVariables,
  VerifyUserAccountMutation,
  VerifyUserAccountMutationVariables,
  ResendActivationEmailMutation,
  ResendActivationEmailMutationVariables,

  // Profile
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables,
  UpdateCertificateNameMutation,
  UpdateCertificateNameMutationVariables,

  // Password
  ChangeUserPasswordMutation,
  ChangeUserPasswordMutationVariables,
  UserPasswordResetMutation,
  UserPasswordResetMutationVariables,
  UserPasswordResetEmailMutation,
  UserPasswordResetEmailMutationVariables,

  // Account lifecycle
  ArchiveUserAccountMutation,
  ArchiveUserAccountMutationVariables,
  DeleteUserAccountMutation,
  DeleteUserAccountMutationVariables,

  // Social auth
  SocialAuthMutation,
  SocialAuthMutationVariables,

  // Enums / scalars
  UserGender,
} from 'src/graphql/generated'

// TODO: LoginUserWithUserName missing from generated.ts (schema drift)
// TODO: GetAllInstructorsStatiscs missing from generated.ts (schema drift)
// TODO: GetTotalUsers / GetTotalUsersStatistics missing from generated.ts (schema drift)
// TODO: ResetUserPassword missing from generated.ts (schema drift — only UserPasswordReset / UserPasswordResetEmail exist)
// TODO: SetUserPassword missing from generated.ts (schema drift)
// Note: `CreateSocailAuth.js` maps to the SocialAuth operation in generated.ts.

// ---------------------------------------------------------------------------
// Domain entities — extracted from selection sets so consumers don't have to
// drill through nullable wrappers (`result.me!.firstName`) in every component.
// ---------------------------------------------------------------------------

/** The current signed-in user as returned by the `me` query. */
export type AuthUser = NonNullable<GetMyProfileDataQuery['me']>

/** Token + user envelope produced by the email login mutation. */
export type LoginResult = NonNullable<LoginUserMutation['tokenAuth']>

/** The user object embedded inside a successful login response. */
export type LoginSessionUser = NonNullable<LoginResult['user']>

/** Token refresh payload (new access + refresh tokens). */
export type RefreshTokenResult = NonNullable<RefreshUserTokenMutation['refreshToken']>

/** Social auth envelope (token + nested social profile + user). */
export type SocialAuthResult = NonNullable<SocialAuthMutation['socialAuth']>
export type SocialAuthProfile = NonNullable<SocialAuthResult['social']>
export type SocialAuthSessionUser = NonNullable<SocialAuthProfile['user']>

/** Registration response (token issued on successful signup). */
export type RegisterResult = NonNullable<RegisterNewUserMutation['register']>

/** Password change response. */
export type ChangePasswordResult = NonNullable<ChangeUserPasswordMutation['passwordChange']>

/** User payload returned after a profile update. */
export type UpdateProfileResult = NonNullable<UpdateUserProfileMutation['updateUserProfile']>
export type UpdatedProfileUser = NonNullable<UpdateProfileResult['user']>

// A User shape wide enough for the Pinia auth store state — unifies the user
// as returned by `me`, login, and social-auth flows.
export type AuthSessionUser = AuthUser | LoginSessionUser | SocialAuthSessionUser

// ---------------------------------------------------------------------------
// Result / Variables aliases — one stable pair per owned operation.
// Use these everywhere instead of the verbose `*MutationVariables` names.
// ---------------------------------------------------------------------------

// --- Profile query ---
export type GetMyProfileVariables = GetMyProfileDataQueryVariables
export type GetMyProfileResult = GetMyProfileDataQuery

// --- Login / tokens ---
export type LoginVariables = LoginUserMutationVariables
export type LoginMutationResult = LoginUserMutation

export type RefreshTokenVariables = RefreshUserTokenMutationVariables
export type RefreshTokenMutationResult = RefreshUserTokenMutation

export type RevokeRefreshTokenVariables = RevokeUserRefreshTokenMutationVariables
export type RevokeRefreshTokenResult = RevokeUserRefreshTokenMutation

export type VerifyTokenVariables = VerifyUserTokenMutationVariables
export type VerifyTokenResult = VerifyUserTokenMutation

// --- Registration / activation ---
export type RegisterVariables = RegisterNewUserMutationVariables
export type RegisterMutationResult = RegisterNewUserMutation

export type VerifyAccountVariables = VerifyUserAccountMutationVariables
export type VerifyAccountResult = VerifyUserAccountMutation

export type ResendActivationEmailVariables = ResendActivationEmailMutationVariables
export type ResendActivationEmailResult = ResendActivationEmailMutation

// --- Profile mutations ---
export type UpdateProfileVariables = UpdateUserProfileMutationVariables
export type UpdateProfileMutationResult = UpdateUserProfileMutation

export type UpdateCertificateNameVariables = UpdateCertificateNameMutationVariables
export type UpdateCertificateNameResult = UpdateCertificateNameMutation

// --- Password ---
export type ChangePasswordVariables = ChangeUserPasswordMutationVariables
export type ChangePasswordMutationResult = ChangeUserPasswordMutation

export type PasswordResetVariables = UserPasswordResetMutationVariables
export type PasswordResetResult = UserPasswordResetMutation

export type PasswordResetEmailVariables = UserPasswordResetEmailMutationVariables
export type PasswordResetEmailResult = UserPasswordResetEmailMutation

// --- Account lifecycle ---
export type ArchiveAccountVariables = ArchiveUserAccountMutationVariables
export type ArchiveAccountResult = ArchiveUserAccountMutation

export type DeleteAccountVariables = DeleteUserAccountMutationVariables
export type DeleteAccountResult = DeleteUserAccountMutation

// --- Social auth ---
export type SocialAuthVariables = SocialAuthMutationVariables
export type SocialAuthMutationResult = SocialAuthMutation

// ---------------------------------------------------------------------------
// Enums / scalars
// ---------------------------------------------------------------------------
export type { UserGender }
