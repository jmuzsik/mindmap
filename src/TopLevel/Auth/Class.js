export default class Auth {
  static deAuthenticateUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
  static getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  static setUser(user) {
    return localStorage.setItem("user", JSON.stringify(user));
  }
  static setTokens({ token, refreshToken }) {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  }
  static getTokens() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    return { token, refreshToken };
  }
}
