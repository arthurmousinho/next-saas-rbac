import { api } from "../api-client";

interface Request {
    email: string;
    password: string;
}

interface Response {
    token: string;
}

export async function signInWithPassword(data: Request): Promise<Response> {
    const result = await api.post(
        'sessions/password',
        { json: data }
    ).json<Response>();

    return result;
}