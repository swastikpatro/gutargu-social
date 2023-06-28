import { URL } from '../constants';

export const wait = (delay = 500) =>
  new Promise((res) => setTimeout(res, delay));

export const showToast = ({ toast, type, message }) => {
  toast({
    title: message,
    status: type,
    position: 'top-right',
    duration: 1000,
    isClosable: true,
  });
};

export const loginService = async ({ email, password }) => {
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

export const getCreatedDate = (dateString) =>
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

const lowerizedAndIsStartsWith = ({ text, textSearched }) => {
  return text.toLowerCase().startsWith(textSearched.toLowerCase());
};

export const filterOnFirstLastAndUserName = ({ list, trimmedSearchText }) =>
  list.filter(
    ({ username, lastName, firstName }) =>
      lowerizedAndIsStartsWith({
        text: username,
        textSearched: trimmedSearchText,
      }) ||
      lowerizedAndIsStartsWith({
        text: firstName,
        textSearched: trimmedSearchText,
      }) ||
      lowerizedAndIsStartsWith({
        text: lastName,
        textSearched: trimmedSearchText,
      })
  );

export const hasEqualProperties = ({ stateData, dataObj }) => {
  return Object.keys(stateData).every((key) => {
    let stateKey = stateData[key];
    if (typeof stateKey === 'string') {
      stateKey = stateKey.trim();
    }

    return stateKey === dataObj[key];
  });
};
