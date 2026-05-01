export interface AccessJwtToken {
  access_token: string;
}

export interface RefreshJwtToken {
  refresh_token: string;
}

export interface FullJwtToken extends AccessJwtToken, RefreshJwtToken {}
