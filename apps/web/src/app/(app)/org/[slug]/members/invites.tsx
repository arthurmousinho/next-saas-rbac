import { ability, getCurrentOrgSlug } from "@/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getInvites } from "@/http/invites/get-invites";
import { Button } from "@/components/ui/button";
import { XOctagon } from "lucide-react";
import { RevokeInviteButton } from "./revoke-invite-button";

export async function Invites() {

    const curretnOrgSlug = await getCurrentOrgSlug();
    const permission = await ability();

    const canCreateInvite = permission?.can("create", "Invite");
    const canRevokeInvite = permission?.can("delete", "Invite");

    const { invites } = await getInvites(curretnOrgSlug!);

    return (
        <div className="space-y-4">
            {canCreateInvite && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Invite member
                        </CardTitle>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>
            )}
            <main className="space-y-2">
                <h2 className="text-lg font-semibold">
                    Invites
                </h2>
                <div className="rounded border">
                    <Table>
                        <TableBody>
                            {invites.map(invite => (
                                <TableRow key={invite.id}>
                                    <TableCell className="py-2.5">
                                        <span className="text-muted-foreground">
                                            {invite.email}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        {invite.role}
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex justify-end">
                                            {canRevokeInvite && (
                                                <RevokeInviteButton
                                                    inviteId={invite.id}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {invites.length === 0 && (
                                <TableRow>
                                    <TableCell className="py-2.5 text-center text-muted-foreground">
                                        No invites found
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    )
}