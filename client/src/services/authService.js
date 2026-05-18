import * as authApi from '../api/authApi';

const TOKEN_KEY = 'ww_token';
const USER_KEY  = 'ww_user';

const authService = {

  async signup(credentials) {
    const data = await authApi.signup(credentials);
    this._saveSession(data.token, data.user);
    return data;
  },

  async login(credentials) {
    const data = await authApi.login(credentials);
    this._saveSession(data.token, data.user);
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  restoreSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user  = localStorage.getItem(USER_KEY);
    return {
      token: token || null,
      user:  user ? JSON.parse(user) : null,
    };
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  _saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

export default authService;