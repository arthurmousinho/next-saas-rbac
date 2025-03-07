import { Button } from "@/components/ui/button";
import { XOctagon } from "lucide-react";
import type { ComponentProps } from "react";
import { revokeInviteAction } from "./actions";

interface RevokeInviteButtonProps extends ComponentProps<typeof Button> {
    inviteId: string;
}

export function RevokeInviteButton({
    inviteId,
    ...props
}: RevokeInviteButtonProps) {
    return (
        <form action={revokeInviteAction.bind(null, { inviteId })}>
            <Button size="sm" variant="destructive" {...props}>
                <XOctagon className="" />
                Revoke invite
            </Button>
        </form>
    )
}