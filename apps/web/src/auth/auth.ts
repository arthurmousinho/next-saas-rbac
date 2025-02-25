import { getProfile } from "@/http/auth/get-profile";
import { getMembership } from "@/http/organization/get-membership";
import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
    const token = (await cookies()).get('token')?.value;
    return Boolean(token);
}

export async function getCurrentOrgSlug() {
    const currentOrgSlugFromCookies = (await cookies()).get("org")?.value;
    return currentOrgSlugFromCookies;
}

export async function getCurrentMembership() {
    const orgSlug = await getCurrentOrgSlug();

    if (!orgSlug) {
        return null;
    }

    const { membership } = await getMembership(orgSlug);
    return membership
}

export async function ability() {
    const membership = await getCurrentMembership();

    if (!membership) {
        return null;
    }

    const ability = defineAbilityFor({
        id: membership.userId,
        role: membership.role,
    });

    return ability;
}

export async function auth() {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        redirect('/auth/sign-in');
    }

    try {
        const data = await getProfile();
        console.log('Profile data:', data);
        return data;
    } catch (error) {
        console.error('Profile error:', error);
    }


    redirect('api/auth/sign-out');
}