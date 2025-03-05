import type { Role } from "@saas/auth";
import { api } from "../api-client"

interface Reponse {
    members: {
        name: string | null;
        id: string;
        avatarUrl: string | null;
        role: Role;
        userId: string;
        email: string;
    }[]
};

interface Request {
    slug: string;
};

export async function getMembers(data: Request): Promise<Reponse> {
    const result = await api
        .get(`organization/${data.slug}/members`)
        .json<Reponse>()

    return result
}