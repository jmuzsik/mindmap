// I am intentionally avoiding all state passed through history
// so we are dependent on API calls

import getSubject from "./ApiCalls/getSubject";

export function handleFirstSubjectRoute({ location: { state }, history }) {
  if (!state || !state.firstSubject) {
    // This page should only be accessible instantly after the user signs up, so reroute otherwise
    return { reroute: "home", history, ...state };
  }
  return {
    history,
    ...state,
  };
}

export function handleHomeRoute(renderProps, props) {
  const {
    authInfo: {
      user: { defaultSubject },
    },
  } = props;
  // This is when no subject has yet been created - should only run after signup
  if (!defaultSubject) {
    return { error: "no subject", ...renderProps, ...props };
  }
  return {
    ...renderProps,
    ...props,
  };
}
