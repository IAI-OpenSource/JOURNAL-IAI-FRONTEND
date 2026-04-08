export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  last_name: string;
  first_name: string;
  jeton: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}