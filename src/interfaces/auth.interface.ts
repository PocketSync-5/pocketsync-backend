export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullname: string;
  };
}
