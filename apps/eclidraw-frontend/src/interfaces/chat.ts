export type ChatMessage = {
    id: string;
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        photo: string;
    };
};