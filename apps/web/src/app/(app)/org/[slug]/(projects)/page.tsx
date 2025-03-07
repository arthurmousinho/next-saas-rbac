import { ability, getCurrentOrgSlug } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectList } from "./project-list";

export default async function Projects() {

    const currentOrgSlug = await getCurrentOrgSlug();

    const permissions = await ability();
    const canCreateProject = permissions?.can('create', 'Project');
    const canListProjects = permissions?.can('get', 'Project');

    return (
        <div className="space-y-4">
            <main className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Projects
                </h1>
                {canCreateProject && (
                    <Button asChild size="sm">
                        <Link href={`/org/${currentOrgSlug}/create-project`}>
                            Create Project
                        </Link>
                    </Button>
                )}
            </main>
            {canListProjects
                ? <ProjectList />
                : (
                    <p className="text-sm text-muted-foreground">
                        You're not allowed to see organization projects
                    </p>
                )
            }
        </div>
    );
}