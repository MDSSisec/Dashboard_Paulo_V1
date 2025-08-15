import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const RedirectHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Redirecionar /dados para /
    if (location.pathname === '/dados' || location.pathname.startsWith('/dados/')) {
      window.location.href = '/';
    }
  }, [location]);

  return null;
};
