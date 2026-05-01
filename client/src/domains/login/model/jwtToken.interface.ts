export interface AccessJwtToken {
  access_token: string;
}

export interface RefreshJwtToken {
  refresh_token: string;
}

export interface FullJwtToken extends AccessJwtToken, RefreshJwtToken {}

export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
}
