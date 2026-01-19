import { UserProfileCard } from '@/libs/features/user-profile/components/user-profile-card';
import { getUserProfileInformation } from '@/libs/features/user-profile/api/logic';

export default async function Home() {
    const user = await getUserProfileInformation('user-1234');

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <UserProfileCard user={user} />
        </div>
    );
}
