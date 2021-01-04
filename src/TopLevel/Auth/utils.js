import Auth from "./AuthCheck";
import Logout from "./Logout";
import AuthClass from "./Class";

export const onLogout = async (setAuthInfo) => {
  const { refreshToken } = AuthClass.getTokens();
  let deleteSuccess;
  try {
    deleteSuccess = await Logout(refreshToken);
  } catch (error) {
    return false;
  }
  if (deleteSuccess.error) {
    return false;
  }
  AuthClass.deAuthenticateUser();
  // No need for storage after logging out for now
  localStorage.clear();
  if (deleteSuccess) {
    setAuthInfo({
      authenticated: false,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        createdAt: "",
        picture: "",
        pictureAlt: "",
        theme: "light",
        currentSubject: "",
        subjects: [],
      },
      token: null,
      refreshToken: null,
    });
  }
};

export async function handleAuth(token, refreshToken) {
  let response;
  try {
    response = await Auth(token, refreshToken);
  } catch (err) {
    console.log("this is error when doing auth func", err);
    return { authenticated: false };
  }
  // By default all error responses return false
  if (response.error) {
    if (token || refreshToken) {
      AuthClass.deAuthenticateUser();
    }
    return { authenticated: false };
  }
  let returnObj = {
    authenticated: true,
  };
  if (response.info === "updated token") {
    AuthClass.authenticateUser({
      token: response.token,
      refreshToken: response.refreshToken,
    });
    returnObj.newToken = true;
    returnObj.token = token;
    returnObj.refreshToken = token;
  }
  return returnObj;
}
