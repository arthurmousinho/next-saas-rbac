import { api } from "../api-client";
import { Role } from "@saas/auth";

interface Response {
    membership: {
        id: string;
        role: Role;
        organizationId: string;
        userId: string;
    }
}

interface Request {
    slug: string;
}

export async function getMembership(data: Request): Promise<Response> {
    const result = await api.get(`organizations/${data.slug}/membership`).json<Response>()
    return result
}