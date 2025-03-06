'use client'

import type { ComponentProps } from "react";
import type { Role } from "@saas/auth";

import { updateMemberAction } from "./actions";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
    memberId: string;
}

export function UpdateMemberRoleSelect({
    memberId,
    ...props
}: UpdateMemberRoleSelectProps) {

    async function handleUpdateMemberRole(role: Role) {
        await updateMemberAction({
            memberId,
            role
        });
    }

    return (
        <Select {...props} onValueChange={handleUpdateMemberRole}>
            <SelectTrigger className="w-32 h-8">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
            </SelectContent>
        </Select>
    )
}