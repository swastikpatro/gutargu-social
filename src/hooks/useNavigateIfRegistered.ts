import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store-hooks';
import { updateLogOutStatus } from '../store/authSlice';

interface useNavigateIfRegisteredPropType {
  token: string | null;
  isLoggedOut: boolean;
}

const useNavigateIfRegistered = ({
  token,
  isLoggedOut,
}: useNavigateIfRegisteredPropType) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (isLoggedOut) {
      navigate('/', { replace: true });
      dispatch(updateLogOutStatus());
      return;
    }

    navigate(location?.state?.from ?? '/', { replace: true });
  }, [token]);
};

export default useNavigateIfRegistered;
