'use client';
import { type FC } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/libs/features/user-profile/api/models';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcwIcon } from 'lucide-react';
import { useUserProfile } from '@/libs/features/user-profile/hooks';
import { clsx } from 'clsx';

interface UserProfileCardViewProps {
    // Add view-specific props here
    user: User;
}

export const UserProfileCardView: FC<UserProfileCardViewProps> = (props: UserProfileCardViewProps) => {
    const { user } = props;

    const { data, isLoading, refresh } = useUserProfile({ id: user.id });

    return (
        <Card className={clsx('w-80', isLoading && 'animate-pulse')}>
            <CardHeader>
                <div className={'flex w-full items-center justify-between'}>
                    <div>
                        <CardTitle>{data?.name ?? user.name}</CardTitle>
                        <CardDescription>Contact Information</CardDescription>
                    </div>
                    <Button variant={'outline'} onClick={() => refresh()} disabled={isLoading}>
                        <RefreshCcwIcon />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p>
                    {data?.name ?? user.name} {data?.description ?? user.description}
                </p>
            </CardContent>
            <CardFooter>
                <Button disabled={isLoading} onClick={() => open(`mailto:${data?.email ?? user.email}`)}>
                    Email {data?.name ?? user.name}
                </Button>
            </CardFooter>
        </Card>
    );
};
