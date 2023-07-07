import { TOAST_TYPE, URL } from '../constants';

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

// export const getCreatedDate = (dateString) =>
//   new Date(dateString).toLocaleDateString('en-IN', {
//     month: 'long',
//     day: 'numeric',
//     year: 'numeric',
//   });

export const getFormattedDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const getCreatedDate = (date) => {
  const pastDate = new Date(date);
  const timeDifference = new Date() - pastDate;
  if (timeDifference < 86400000) {
    // 86400000 milliseconds = 1 day
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifference / (1000 * 60)) % 60);

    if (hoursDifference === 0) {
      return `${minutesDifference}m ago`;
    } else {
      return `${hoursDifference}h ago`;
    }
  } else {
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysDifference > 30) {
      return getFormattedDate(date);
    } else {
      return `${daysDifference}d ago`;
    }
  }
};

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

// works for both posts and comments
export const getUpdatedWithMainUserDetails = ({
  posts = [],
  mainUserDetails,
  propName,
}) => {
  return posts.map((singleItem) => {
    if (singleItem[propName]._id === mainUserDetails?._id) {
      return {
        ...singleItem,
        [propName]: Object.keys(singleItem[propName]).reduce(
          (acc, currentKey) => {
            acc[currentKey] = mainUserDetails[currentKey];
            return acc;
          },
          {}
        ),
      };
    } else {
      return singleItem;
    }
  });
};

export const getFollowCacheKey = (userId) => `follow-user-${userId}`;
