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

export async function getMembership(slug: string) {
    const result = await api.get(`organizations/${slug}/membership`).json<Response>()
    return result
}