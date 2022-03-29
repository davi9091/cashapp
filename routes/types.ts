export interface INotesBody {
    title: string;
    body: string;
}

export interface IUser {
    id: number;
    token: string;
    username: string;
    firstName?: string;
    lastName?: string;
}
