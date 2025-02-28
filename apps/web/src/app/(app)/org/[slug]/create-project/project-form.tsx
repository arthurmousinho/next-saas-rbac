'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createProjectAction } from "./actions";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm() {

    const [formState, handleSubmit, isPending] = useFormState(
        createProjectAction
    )

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>

            {formState.success === false && formState.message && (
                <Alert variant='destructive'>
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Project creation failed!</AlertTitle>
                    <AlertDescription>{formState.message}</AlertDescription>
                </Alert>
            )}

            {formState.success === true && formState.message && (
                <Alert variant="success">
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{formState.message}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-1">
                <Label htmlFor="name">Project Name</Label>
                <Input name="name" id="name" type="text" />

                {formState.errors?.name && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {formState.errors.name[0]}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="name">Project Description</Label>
                <Textarea name="description" id="description" />

                {formState.errors?.name && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {formState.errors.name[0]}
                    </p>
                )}
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Save project'
                )}
            </Button>
        </form>
    )
}