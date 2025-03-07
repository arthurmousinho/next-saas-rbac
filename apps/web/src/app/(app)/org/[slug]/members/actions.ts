'use server'

import { getCurrentOrgSlug } from "@/auth/auth";
import { createInvite } from "@/http/invites/create-invite";
import { revokeInvite } from "@/http/invites/revoke-invite";
import { removeMember } from "@/http/members/remover-member";
import { updateMember } from "@/http/members/update-member";
import { roleSchema, type Role } from "@saas/auth";
import { HTTPError } from "ky";
import { revalidateTag } from "next/cache";
import { z } from "zod";

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


const createInviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  role: roleSchema
})

export async function createInviteAction(data: FormData) {

  const result = createInviteSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, role } = result.data;
  const currentOrgSlug = await getCurrentOrgSlug();

  try {
  await createInvite({
      orgSlug: currentOrgSlug!,
      email,
      role
    });

    revalidateTag(`${currentOrgSlug}/invites`);
  } catch (err) {

    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created invite',
    errors: null
  }
}