import { getCurrentOrgSlug } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { shutdownOrganization } from "@/http/organization/shutdown-organization";
import { XCircle } from "lucide-react";
import { redirect } from "next/navigation";

export function ShutdownOrganizationButton() {

    async function shutdownOrganizationAction() {
        'use server';

        const currentOrgSlug = await getCurrentOrgSlug();
        await shutdownOrganization({ slug: currentOrgSlug || '' });

        redirect('/');
    }

    return (
        <form action={shutdownOrganizationAction}>
            <Button variant='destructive' className="w-56" type="submit">
                <XCircle className="size-4 mr-2" />
                Shutdown organization
            </Button>
        </form>
    )
}