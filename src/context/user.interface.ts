import { UserRole } from '../utilities/UserRoles';

export interface UserInterface {
    id: string;
    username: string;
    email: string;
    role: UserRole;
}