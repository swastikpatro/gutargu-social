import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateLogOutStatus } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const useNavigateIfRegistered = ({ token, isLoggedOut }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
