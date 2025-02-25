import { api } from "../api-client";

interface Request {
    name: string;
    email: string;
    password: string;
}

type Response = never;

export async function signUp(data: Request): Promise<Response> {
    const result = await api.post(
        'users',
        {
            json: {
                name: data.name,
                email: data.email,
                password: data.password,
            }
        }
    ).json<Response>();

    return result;
}