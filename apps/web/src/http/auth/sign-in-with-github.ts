import { api } from "../api-client";

interface Request {
    code: string;
}

interface Response {
    token: string;
}

export async function signInGithub(data: Request): Promise<Response> {
    const result = await api.post(
        'sessions/github',
        {
            json: {
                code: data.code,
            }
        }
    ).json<Response>();

    return result;
}