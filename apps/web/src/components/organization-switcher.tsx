import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getOrganizations } from "@/http/organization/get-organizations";
import { getCurrentOrgSlug } from "@/auth/auth";

export async function OrganizationSwitcher() {

    const currentOrgSlugFromCookies = await getCurrentOrgSlug();
    
    const { organizations } = await getOrganizations();

    const currentOrganization = organizations.find(
        org => org.slug === currentOrgSlugFromCookies
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-[164px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {currentOrganization
                    ? (
                        <>
                            <Avatar className="mr-2 size-5">
                                {currentOrganization.avatarUrl && (
                                    <AvatarImage src={currentOrganization.avatarUrl} />
                                )}
                                <AvatarFallback />
                            </Avatar>
                            <span className="truncate text-left">
                                {currentOrganization.name}
                            </span>
                        </>
                    )
                    : (
                        <span className="text-muted-foreground">
                            Select organization
                        </span>
                    )
                }
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                alignOffset={-16}
                sideOffset={12}
                className="w-[200px]"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        Organizations
                    </DropdownMenuLabel>
                    {organizations?.map(organization => (
                        <DropdownMenuItem key={organization.id} asChild>
                            <Link href={`/org/${organization.slug}`}>
                                <Avatar className="mr-2 size-5">
                                    {organization.avatarUrl && (
                                        <AvatarImage src={organization.avatarUrl} />
                                    )}
                                    <AvatarFallback />
                                </Avatar>
                                <span className="line-clamp-1">
                                    {organization.name}
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/create-organization">
                        <PlusCircle className="size-5 mr-2" />
                        Create new
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}