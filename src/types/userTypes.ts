export interface TUserDetails {
  email: string;
  password: string;
}

export interface TNewUserDetails extends TUserDetails {
  name: string;
}

export interface TLoggedInUser {
  name: string;
  email: string;
  id: number;
  accessToken: string;
}
