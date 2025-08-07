import React, { act, createContext, useContext, useReducer } from "react";

const initialState = {
  user: null,
  videoRecordPrsignedUrls: [],
  fileDetails: null,
  videoFormDetails: null,
  videoCaptureDetails: null,
  openSubTaskForm: false,
  loader: false,
};

function globalReducer(state, action) {
  console.log("state", action);
  switch (action.type) {
    case "GETCURRENTUSER":
      return {
        ...state,
        user: action?.data,
      };

    case "STARTUPLOADING":
      return {
        ...state,
        fileDetails: action?.data,
      };
    case "GETPRESIGNEDURLS":
      return {
        ...state,
        videoRecordPrsignedUrls: action?.data,
      };

    case "FORMDETAILS":
      return {
        ...state,
        videoFormDetails: action?.data,
      };
    case "ADDBUGREPORTBEFORERECORDING":
      return {
        ...state,
        videoCaptureDetails: action?.data,
      };

    case "HANDLESUBTASKFORM":
      return {
        ...state,
        openSubTaskForm: action.data,
      };

    case "HANDLELOADER":
      return {
        ...state,
        loader: action.data,
      };

    case "CANCELRECORDING":
      return {
        ...state,
        videoRecordPrsignedUrls: action?.data?.videoRecordPrsignedUrls,
        fileDetails: null,
        videoCaptureDetails: null,
        videoFormDetails: null,
      };

    case "NETORKANDUPDATEURL":
      return {
        ...state,
        videoRecordPrsignedUrls: action?.data?.videoRecordPrsignedUrls,
        fileDetails: null,
        videoCaptureDetails: null,
        videoFormDetails: null,
      };

    default:
      return state;
  }
}

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
