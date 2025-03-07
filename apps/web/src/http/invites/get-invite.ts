import { api } from "../api-client";
import type { Role } from "@saas/auth";

interface GetInviteResponse {
    invite: {
        id: string;
        organization: {
            name: string;
        };
        createdAt: Date;
        role: Role;
        email: string;
        author: {
            id: string;
            name: string | null;
            avatarUrl: string | null;
        } | null;
    }
}

export async function getInvite(inviteId: string) {
    const result = await api
        .get(
            `invites/${inviteId}`,
            {
                next: {
                    tags: [`invites/${inviteId}`]
                }
            }
        )
        .json<GetInviteResponse>()

    return result
}