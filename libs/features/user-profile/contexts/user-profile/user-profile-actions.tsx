export enum UserProfileActionType {
  setLoading = "SET_LOADING",
  setError = "SET_ERROR",
  reset = "RESET",
}

export interface SetLoadingAction {
  type: UserProfileActionType.setLoading;
  payload: boolean;
}

export interface SetErrorAction {
  type: UserProfileActionType.setError;
  payload: string | undefined;
}

export interface ResetAction {
  type: UserProfileActionType.reset;
}

export type UserProfileAction =
  | SetLoadingAction
  | SetErrorAction
  | ResetAction;
