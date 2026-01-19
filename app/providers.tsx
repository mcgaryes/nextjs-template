'use client';

import { UserProfileProvider } from '@/libs/features/user-profile/contexts';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <UserProfileProvider>{children}</UserProfileProvider>;
}
