export default async (token) => {
  let result;

  const url = `/api/users/forgot/${token}`;

  let options = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrer: 'no-referrer'
  };

  try {
    result = await fetch(url, options);
  } catch (err) {
    console.log('this should not happen', err);
  }
  try {
    if (result) {
      return result.json();
    } else {
      return { err: 'failed' };
    }
  } catch (err) {
    return err;
  }
};
