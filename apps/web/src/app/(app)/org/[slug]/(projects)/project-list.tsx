import { getCurrentOrgSlug } from "@/auth/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { getProjects } from "@/http/project/get-projects";
import { ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export async function ProjectList() {

    const currentOrgSlug = await getCurrentOrgSlug();
    const { projects } = await getProjects(currentOrgSlug!);

    function getDaysAgo(date: string) {
        const daysAgo = Math.floor(
            (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24)
        );
        return daysAgo;
    }

    return (
        <div className="grid grid-cols-3 gap-4 w-full">
            {projects.map(project => (
                <Card key={project.id} className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-xl font-medium">
                            {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 leading-relaxed">
                            {project.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-1.5">
                        <Avatar className="size-4">
                            <AvatarFallback />
                            <AvatarImage
                                src={project.owner.avatarUrl ?? ''}
                                alt={project.owner.name ?? ''}
                            />
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate">
                            <span className="font-medium text-foreground">{project.owner.name}</span> {dayjs(project.createdAt).fromNow()}
                        </span>
                        <Button size="xs" className="ml-auto" variant="outline">
                            View <ArrowRight className="size-3 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}