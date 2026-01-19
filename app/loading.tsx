import { UserProfileCardLoading } from '@/libs/features/user-profile/components';

export default async function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <UserProfileCardLoading />
        </div>
    );
}
