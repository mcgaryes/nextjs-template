import { type UserProfileState, userProfileInitialState } from "./user-profile-state";
import { type UserProfileAction, UserProfileActionType } from "./user-profile-actions";

export function userProfileReducer(
  state: UserProfileState,
  action: UserProfileAction
): UserProfileState {
  switch (action.type) {
    case UserProfileActionType.setLoading:
      return {
        ...state,
        isLoading: action.payload,
      };

    case UserProfileActionType.setError:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case UserProfileActionType.reset:
      return userProfileInitialState;

    default:
      return state;
  }
}
