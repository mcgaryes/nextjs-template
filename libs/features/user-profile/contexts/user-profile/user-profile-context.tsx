"use client";

import { createContext, type Dispatch } from "react";
import { type UserProfileState, userProfileInitialState } from "./user-profile-state";
import { type UserProfileAction } from "./user-profile-actions";

export const UserProfileContext = createContext<{
  state: UserProfileState;
  dispatch: Dispatch<UserProfileAction>;
}>({
  state: userProfileInitialState,
  dispatch: () => {},
});
