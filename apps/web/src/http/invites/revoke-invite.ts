import { api } from "../api-client";

interface RevokeInviteRequest {
    orgSlug: string;
    inviteId: string;
}

export async function revokeInvite(parms: RevokeInviteRequest) {
    await api.delete(`organization/${parms.orgSlug}/invites/${parms.inviteId}`)
}