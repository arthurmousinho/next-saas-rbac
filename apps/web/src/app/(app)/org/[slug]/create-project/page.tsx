import Header from "@/components/header";
import { ProjectForm } from "./project-form";
import { ability } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function CreateProject() {
 
    const permission = await ability()

    if (permission?.cannot('create', 'Project')) {
        redirect('/');
    }

    return (
        <div className="py-4 space-y-4">
            <Header />
            <main className="mx-auto w-full max-w-[1200px] space-y-4">
                <h1 className="text-2xl font-bold">
                    Create project
                </h1>
                <ProjectForm />
            </main>
        </div>
    )
}