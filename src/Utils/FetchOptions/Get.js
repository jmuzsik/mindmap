// * https://security.stackexchange.com/questions/179498/is-it-safe-to-store-a-jwt-in-sessionstorage/179507#179507
export default (authorization = null, blob = "") => {
  const req = {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrer: "no-referrer",
    headers: {
      "Content-Type": "application/json",
      "X-Frame-Options": "Deny",
      "X-XSS-Protection": 1,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
    },
    responseType: blob,
  };
  if (blob) {
    req.responseType = "blob";
    req.headers.Accept = "image/*";
  }
  if (authorization) {
    req.headers.Authorization = `Bearer ${authorization}`;
  }
  return req;
};
