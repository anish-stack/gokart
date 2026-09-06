import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, fetchMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('go_admin_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('go_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((me) => {
        setUser(me);
        localStorage.setItem('go_admin_user', JSON.stringify(me));
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, user: loggedInUser } = await loginRequest(email, password);
    localStorage.setItem('go_admin_token', token);
    localStorage.setItem('go_admin_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    localStorage.removeItem('go_admin_token');
    localStorage.removeItem('go_admin_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
