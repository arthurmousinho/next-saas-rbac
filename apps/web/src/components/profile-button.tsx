import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOutIcon } from "lucide-react";
import { auth } from "@/auth/auth";

function getInitials(name: string): string {
    const initials = name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')

    return initials
}

export async function ProfileButton() {

    const { user } = await auth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">
                        {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {user.email}
                    </span>
                </div>
                <Avatar className="size-8">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                    {user.name && <AvatarFallback>
                        {getInitials(user.name)}
                    </AvatarFallback>}
                </Avatar>
                <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <a href="/api/auth/sign-out">
                        <LogOutIcon className="size-4 mr-2" />
                        Sign out
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}