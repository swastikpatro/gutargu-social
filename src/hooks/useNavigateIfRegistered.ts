import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useNavigateIfRegistered = (token: string | null) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      navigate(location?.state?.from ?? '/', { replace: true });
    }
  }, [token]);
};

export default useNavigateIfRegistered;
