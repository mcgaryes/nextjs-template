'use client';

import { type FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { useUserProfileContext } from '@/libs/features/user-profile/hooks';

export const UserProfileStatus: FC = () => {
  const { isLoading, error } = useUserProfileContext();

  return (
    <div className="flex gap-2">
      <Badge variant={isLoading ? 'default' : 'secondary'}>
        Loading: {isLoading ? 'Yes' : 'No'}
      </Badge>
      <Badge variant={error ? 'destructive' : 'secondary'}>
        Error: {error ?? 'None'}
      </Badge>
    </div>
  );
};
