import { URL } from '../constants';

interface showToastType {
  toast: any;
  type: string;
  message: string;
}

interface loginServiceType {
  email: string;
  password: string;
}

export const showToast = ({ toast, type, message }: showToastType) => {
  toast({
    title: message,
    status: type,
    position: 'top-right',
    duration: 1000,
    isClosable: true,
  });
};

export const loginService = async ({ email, password }: loginServiceType) => {
  const response = await fetch(`${URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const { message, token } = await response.json();

  return { message, token };
};

// export const setIntoLocalStorage = (name : string, dataObj) => {
//   localStorage.setItem(name, JSON.stringify(dataObj));
// };

// export const getFromLocalStorage = (name: string) => {
//   return JSON.parse(localStorage.getItem(name)) ?? null;
// };

// export const removeLocalStorage = (name) => {
//   localStorage.removeItem(name);
// };
