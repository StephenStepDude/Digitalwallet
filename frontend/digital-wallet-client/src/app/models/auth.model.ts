export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: {
    userId: number;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    createdDate: string;
  }
}
