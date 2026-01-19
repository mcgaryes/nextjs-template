'use client';

import { useContext, useCallback } from 'react';
import {
  UserProfileContext,
  UserProfileActionType,
} from '@/libs/features/user-profile/contexts';

export interface UseUserProfileContextReturnValue {
  isLoading: boolean;
  error: string | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  reset: () => void;
}

export function useUserProfileContext(): UseUserProfileContextReturnValue {
  const { state, dispatch } = useContext(UserProfileContext);

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: UserProfileActionType.setLoading, payload: loading });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | undefined) => {
      dispatch({ type: UserProfileActionType.setError, payload: error });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: UserProfileActionType.reset });
  }, [dispatch]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    setLoading,
    setError,
    reset,
  };
}
