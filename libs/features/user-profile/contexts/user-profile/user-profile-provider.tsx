"use client";

import { useReducer, type ReactNode } from "react";
import { UserProfileContext } from "./user-profile-context";
import { userProfileReducer } from "./user-profile-reducer";
import { type UserProfileState, userProfileInitialState } from "./user-profile-state";

export interface UserProfileProviderProps {
  children: ReactNode;
  initialState?: Partial<UserProfileState>;
}

export function UserProfileProvider(props: UserProfileProviderProps) {
  const { children, initialState } = props;
  const [state, dispatch] = useReducer(
    userProfileReducer,
    { ...userProfileInitialState, ...initialState }
  );

  return (
    <UserProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </UserProfileContext.Provider>
  );
}
