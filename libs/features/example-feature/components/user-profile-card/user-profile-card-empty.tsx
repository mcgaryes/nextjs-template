import { type FC } from 'react';

export interface UserProfileCardEmptyProps {
    message?: string;
}

export const UserProfileCardEmpty: FC<UserProfileCardEmptyProps> = ({ message = 'No data available' }) => {
    return <div>{message}</div>;
};
