import gql from 'graphql-tag'

// Server-side logout: clears the Django session and expires the HttpOnly
// `sessionid` cookie that social-login sessions leave behind. JWTs are
// stateless, so the client still discards its own tokens separately (see
// auth store `logOutAction`). The request must send cookies — the Apollo
// upload link is configured with `credentials: 'same-origin'`.
export const LogoutUser = gql`
mutation LogoutUser {
  logoutUser {
    success
    errors
  }
}
`
