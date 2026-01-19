'use client';
import { type FC, Suspense } from 'react';
import {
    UserProfileCardEmpty,
    UserProfileCardErrored,
    UserProfileCardLoading,
    UserProfileCardView,
} from '@/libs/features/user-profile/components';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { User } from '@/libs/features/user-profile/api/models/user';

interface UserProfileCardProps {
    user?: User;
}

export const UserProfileCard: FC<UserProfileCardProps> = (props: UserProfileCardProps) => {
    const { user } = props;

    if (!user) {
        return <UserProfileCardEmpty />;
    }

    return (
        <Suspense fallback={<UserProfileCardLoading />}>
            <ErrorBoundary errorComponent={(error) => <UserProfileCardErrored error={error as unknown as Error} />}>
                <UserProfileCardView user={user!} />
            </ErrorBoundary>
        </Suspense>
    );
};
