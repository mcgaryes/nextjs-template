export interface UserProfileState {
  // Add your state properties here
  isLoading: boolean;
  error?: string;
}

export const userProfileInitialState: UserProfileState = {
  isLoading: false,
  error: undefined,
};
