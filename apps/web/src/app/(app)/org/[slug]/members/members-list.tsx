import { ability, getCurrentOrgSlug } from "@/auth/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getMembers } from "@/http/members/get-members"
import { getMembership } from "@/http/organization/get-membership"
import { getOrganization } from "@/http/organization/get-organization"
import { organizationSchema } from "@saas/auth"
import { ArrowLeftRight, Crown } from "lucide-react"
import Image from "next/image"

export async function MembersList() {

    const currentOrgSlug = await getCurrentOrgSlug();

    const [
        { membership },
        { members },
        { organization }
    ] = await Promise.all([
        getMembership({ slug: currentOrgSlug! }),
        getMembers({ slug: currentOrgSlug! }),
        getOrganization({ slug: currentOrgSlug! })
    ]);

    const permissions = await ability();
    const authOrganization = organizationSchema.parse(organization);

    const canTransferOwnership = permissions?.can('transfer_ownership', authOrganization);

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">
                Members
            </h2>
            <div className="rounded border">
                <Table>
                    <TableBody>
                        {members.map(member => (
                            <TableRow key={member.id}>
                                <TableCell className="py-2.5" style={{ width: 48 }}>
                                    <Avatar>
                                        <AvatarFallback />
                                        {member.avatarUrl && (
                                            <Image
                                                src={member.avatarUrl}
                                                alt={member.name ?? ""}
                                                width={32}
                                                height={32}
                                                className="aspect-square size-full"
                                            />
                                        )}
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <div className="flex flex-col">
                                        <span className="font-medium inline-flex items-center gap-2">
                                            {member.name}
                                            {(membership.userId === membership.userId) && (
                                                ' (me)'
                                            )}
                                            {(organization.ownerId === member.userId) && (
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Crown className="size-3" />
                                                    Owner
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {member.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2.5">
                                    <div className="flex items-center justify-end gap-2">
                                        {canTransferOwnership && (
                                            <Button size="sm" variant="ghost" >
                                                <ArrowLeftRight className="size-4 mr-2" />
                                                Transfer ownership
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}