import type { Role } from "@saas/auth";
import { api } from "../api-client";

interface Request {
    orgSlug: string;
    email: string;
    role: Role;
}

type Response = void;

export async function createInvite(data: Request): Promise<Response> {
    const result = await api.post(
        `organization/${data.orgSlug}/invites`,
        {
            json: {
                email: data.email,
                role: data.role
            }
        }
    ).json<Response>();

    return result;
}