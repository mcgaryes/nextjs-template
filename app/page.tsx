import { UserProfileCard, UserProfileStatus } from '@/libs/features/user-profile/components';
import { getUserProfileInformation } from '@/libs/features/user-profile/api/logic';
import { UserProfileProvider } from '@/libs/features/user-profile/contexts';

export default async function Home() {
    const user = await getUserProfileInformation('user-1234');

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <UserProfileProvider>
                <div className="flex flex-col gap-4">
                    <UserProfileCard user={user} />
                    <UserProfileStatus />
                </div>
            </UserProfileProvider>
        </div>
    );
}
