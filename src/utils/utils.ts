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
  const response = await fetch(`${URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const { message, token } = await response.json();

  return { message, token };
};

export const getCreatedDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const sortByLikeCount = (
  { likes: { likeCount: a } },
  { likes: { likeCount: b } }
) => b - a;

export const sortByCreatedDate = ({ createdAt: a }, { createdAt: b }) => {
  const createdDateA = new Date(a);
  const createdDateB = new Date(b);
  const difference = createdDateA - createdDateB;
  return Math.abs(difference) / 100;
};

export const isFoundInList = ({ list = [], idToBeChecked }) => {
  const isFound = list.findIndex(({ _id }) => _id === idToBeChecked);

  return isFound !== -1;
};

export const isIncludedInList = ({ list = [], idToBeChecked }) =>
  list.includes(idToBeChecked);

// export const setIntoLocalStorage = (name : string, dataObj) => {
//   localStorage.setItem(name, JSON.stringify(dataObj));
// };

// export const getFromLocalStorage = (name: string) => {
//   return JSON.parse(localStorage.getItem(name)) ?? null;
// };

// export const removeLocalStorage = (name) => {
//   localStorage.removeItem(name);
// };
