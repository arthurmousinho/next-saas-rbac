'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

interface NavLinKProps extends ComponentProps<typeof Link> { };

export function NavLink(props: NavLinKProps) {
    const pathname = usePathname();
    const isCurrent = pathname === props.href.toString();

    return (
        <Link {...props} data-current={isCurrent} />
    )
}