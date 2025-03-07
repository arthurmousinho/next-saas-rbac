'use server'

import { getCurrentOrgSlug } from "@/auth/auth";
import { revokeInvite } from "@/http/invites/revoke-invite";
import { removeMember } from "@/http/members/remover-member";
import { updateMember } from "@/http/members/update-member";
import type { Role } from "@saas/auth";
import { revalidateTag } from "next/cache";

interface RemoveMemberActionParams {
  memberId: string
}

export async function removeMemberAction(params: RemoveMemberActionParams) {
  const { memberId } = params;

  const currentOrgSlug = await getCurrentOrgSlug();

  await removeMember({
    slug: currentOrgSlug!,
    memberId
  });

  revalidateTag(`${currentOrgSlug}/members`);
}

interface UpdateMemberRoleActionParams {
  memberId: string;
  role: Role;
}

export async function updateMemberAction(parms: UpdateMemberRoleActionParams) {
  const { memberId, role } = parms;

  const currentOrgSlug = await getCurrentOrgSlug();

  await updateMember({
    slug: currentOrgSlug!,
    memberId,
    role
  });

  revalidateTag(`${currentOrgSlug}/members`);
}

interface RevokeInviteActionParams {
  inviteId: string;
}

export async function revokeInviteAction(params: RevokeInviteActionParams) {
  const { inviteId } = params;

  const currentOrgSlug = await getCurrentOrgSlug();

  await revokeInvite({
    orgSlug: currentOrgSlug!,
    inviteId
  });

  revalidateTag(`${currentOrgSlug}/invites`);
}