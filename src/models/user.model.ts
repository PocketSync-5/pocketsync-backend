export interface User{ 
    id: string;
    fullname: string;
    email: string;
    password: string;
    createdAt: string;
}



export type SafeUser = Omit<User, 'password'>;