import { Button } from "./ui/button";
import { ability, getCurrentOrgSlug } from "@/auth/auth";
import { NavLink } from "./nav-link";

export async function Tabs() {

    const currentOrgSlug = await getCurrentOrgSlug();

    const permissions = await ability();

    const canGetProjects = permissions?.can('get', 'Project');
    const canGetMembers = permissions?.can('get', 'User');
    const canUpdateOrganization = permissions?.can('update', 'Organization');
    const canGetBilling = permissions?.can('get', 'Billing');

    return (
        <div className="border-b py-4">
            <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
                {canGetProjects && (
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
                    >
                        <NavLink href={`/org/${currentOrgSlug}`}>
                            Projects
                        </NavLink>
                    </Button>
                )}
                {canGetMembers && (
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
                    >
                        <NavLink href={`/org/${currentOrgSlug}/members`}>
                            Members
                        </NavLink>
                    </Button>
                )}
                {(canUpdateOrganization || canGetBilling) && (
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
                    >
                        <NavLink href={`/org/${currentOrgSlug}/settings`}>
                            Settings & Billing
                        </NavLink>
                    </Button>
                )}
            </nav>
        </div>
    )
}