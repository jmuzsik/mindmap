import React from "react";
import Notes from "../../../Routes/Notes/Notes";

import NewSubjectForm from "../../../Routes/Forms/NewSubjectForm/NewSubjectForm";

import Home from "../../../Routes/Home/Home";
import Images from "../../../Routes/Images/Images";
import Layout from "../../../Components/Layout/Layout";
// const Home = lazy(() => import("../../../Routes/Home/Home"));

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
      user: { currentSubject },
    },
  } = props;
  // This is when no subject has yet been created - should only run after signup
  if (!currentSubject) {
    return { error: "no subject", ...renderProps, ...props };
  }
  return {
    ...renderProps,
    ...props,
  };
}

function getLocation(props) {
  return props?.history?.location?.pathname;
}

export function renderFunction(renderProps, props) {
  const properties = handleHomeRoute(renderProps, props);

  if (properties.error === "no subject") {
    return <NewSubjectForm {...properties} />;
  }
  switch (getLocation(properties)) {
    case "/":
      return <Layout {...properties} />;
    // case "/notes":
    //   return <Notes {...properties} />;
    // case "/images":
    //   return <Images {...properties} />;
    default:
      return <Layout {...properties} />;
  }
}
