import { ability } from "@/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationForm } from "../../organization-form";
import { Button } from "@/components/ui/button";
import { ShutdownOrganizationButton } from "./shutdown-organization-button";

export default async function SettingsPage() {

    const permissions = await ability();

    const canUpdateOrganization = permissions?.can('update', 'Organization');
    const canGetBilling = permissions?.can('get', 'Billing');
    const canShutDownOrganization = permissions?.can('delete', 'Organization');

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
                            <OrganizationForm />
                        </CardContent>
                    </Card>
                )}
                {canShutDownOrganization && (
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