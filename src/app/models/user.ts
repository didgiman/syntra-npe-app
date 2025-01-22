export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    settings: {
        chatgpt: {
            motivational: boolean;
            functional: boolean;
        },
        darkmode: boolean
    }
}