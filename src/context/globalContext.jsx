import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  user: null,
};

function globalReducer(state, action) {
  switch (action.type) {
    case "GETCURRENTUSER":
      return {
        ...state,
        user: action?.data,
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
