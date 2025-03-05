import { ability, getCurrentOrgSlug } from "@/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationForm } from "../../organization-form";
import { ShutdownOrganizationButton } from "./shutdown-organization-button";
import { getOrganization } from "@/http/organization/get-organization";
import Billing from "./billing";

export default async function SettingsPage() {

    const currentOrgSlug = await getCurrentOrgSlug();

    const permissions = await ability();

    const canUpdateOrganization = permissions?.can('update', 'Organization');
    const canGetBilling = permissions?.can('get', 'Billing');
    const canShutdownOrganization = permissions?.can('delete', 'Organization');

    const { organization } = await getOrganization({ slug: currentOrgSlug! });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">
                Settings
            </h1>

            <main className="space-y-4">
                {canUpdateOrganization && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Organization settings
                            </CardTitle>
                            <CardDescription>
                                Update your organization details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrganizationForm
                                isUpdating
                                initialData={{
                                    name: organization.name,
                                    domain: organization.domain,
                                    shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
                                }}
                            />
                        </CardContent>
                    </Card>
                )}
                {canGetBilling && (
                    <Billing />
                )}
                {canShutdownOrganization && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Shutdown organization
                            </CardTitle>
                            <CardDescription>
                                This will delete all organization data, including all project. You can't revert this action.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ShutdownOrganizationButton />
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}