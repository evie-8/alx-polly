import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types/auth";

// TODO: Replace with actual authentication implementation
// This is a placeholder service that simulates API calls

class AuthService {
  private baseUrl = "/api/auth";
  private tokenKey = "auth_token";
  private userKey = "auth_user";

  // Store token in localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from localStorage
  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from localStorage
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Store user in localStorage
  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Get user from localStorage
  private getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Remove user from localStorage
  private removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    console.log("Login attempt:", credentials);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    const mockUser: User = {
      id: "1",
      email: credentials.email,
      name: "John Doe",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockToken = "mock_jwt_token_" + Date.now();

    const response: AuthResponse = {
      user: mockUser,
      token: mockToken,
    };

    // Store in localStorage
    this.setToken(mockToken);
    this.setUser(mockUser);

    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    console.log("Registration attempt:", userData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    const mockUser: User = {
      id: "1",
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockToken = "mock_jwt_token_" + Date.now();

    const response: AuthResponse = {
      user: mockUser,
      token: mockToken,
    };

    // Store in localStorage
    this.setToken(mockToken);
    this.setUser(mockUser);

    return response;
  }

  async logout(): Promise<void> {
    // TODO: Replace with actual API call
    console.log("Logout attempt");

    // Remove from localStorage
    this.removeToken();
    this.removeUser();
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with actual API call to validate token and get user
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) {
      return null;
    }

    // For now, return stored user
    // In real implementation, validate token with backend
    return user;
  }

  async refreshToken(): Promise<string | null> {
    // TODO: Implement token refresh logic
    console.log("Token refresh attempt");
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  getStoredToken(): string | null {
    return this.getToken();
  }

  getStoredUser(): User | null {
    return this.getUser();
  }
}

export const authService = new AuthService();
export default authService;
