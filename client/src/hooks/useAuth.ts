import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/ensureAuthenticated', { withCredentials: true })
      .then(res => {
        setIsAuthenticated(res.data.authenticated);
        setUser(res.data.user || null);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { isAuthenticated, user, loading };
}

