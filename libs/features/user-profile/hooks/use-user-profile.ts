'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { User } from '@/libs/features/user-profile/api/models';

export interface UseUserProfileParams {
    id: string;
}

export interface UseUserProfileReturnValue {
    data: User | null;
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
}

export function useUserProfile(params: UseUserProfileParams): UseUserProfileReturnValue {
    const { id } = params;

    const { data, error, isValidating, mutate } = useSWR<User>(
        `/api/user-profile/${id}`,
        (url: string) => fetch(url).then((res) => res.json()),
        {
            revalidateOnMount: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    );

    const memoizedData = useMemo(() => data ?? null, [data]);

    return {
        data: memoizedData,
        isLoading: isValidating,
        error: error ?? null,
        refresh: mutate,
    };
}
