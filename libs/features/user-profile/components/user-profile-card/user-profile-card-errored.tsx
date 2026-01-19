import { type FC } from 'react';

export interface UserProfileCardErroredProps {
    error?: Error | null;
    onRetry?: () => void;
}

export const UserProfileCardErrored: FC<UserProfileCardErroredProps> = ({ error, onRetry }) => {
    return (
        <div>
            <p>Something went wrong{error?.message ? `: ${error.message}` : ''}</p>
            {onRetry && (
                <button onClick={onRetry} type="button">
                    Try again
                </button>
            )}
        </div>
    );
};
