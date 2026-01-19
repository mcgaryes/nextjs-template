import { type FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const UserProfileCardLoading: FC = () => {
    return (
        <div className="animate-pulse">
            <Card className={'w-80'}>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className={'w-1/2 h-5'} />
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className={'w-2/3 h-3'} />
                    </CardDescription>
                </CardHeader>
                <CardContent className={'space-y-2'}>
                    <Skeleton className={'w-full h-4'} />
                    <Skeleton className={'w-1/2 h-4'} />
                </CardContent>
                <CardFooter>
                    <Button className={'w-1/2'} />
                </CardFooter>
            </Card>
        </div>
    );
};
