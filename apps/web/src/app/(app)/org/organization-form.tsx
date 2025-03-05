'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormState } from "@/hooks/use-form-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createOrganizationAction } from "../create-organization/actions";

export function OrganizationForm() {

    const [formState, handleSubmit, isPending] = useFormState(
        createOrganizationAction
    )

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>

            {formState.success === false && formState.message && (
                <Alert variant='destructive'>
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Organization creation failed!</AlertTitle>
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
                <Label htmlFor="name">Organization Name</Label>
                <Input name="name" id="name" type="text" placeholder="Acme Inc." />

                {formState.errors?.name && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {formState.errors.name[0]}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="domain">E-mail domain</Label>
                <Input
                    name="domain"
                    id="domain"
                    type="text"
                    inputMode="url"
                    placeholder="example.com"
                />

                {formState.errors?.domain && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {formState.errors.domain[0]}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="shouldAttachUsersByDomain"
                        name="shouldAttachUsersByDomain"
                    />
                    <label
                        htmlFor="shouldAttachUsersByDomain"
                        className="space-y-1"
                    >
                        <span className="text-sm font-medium leading-none">
                            Auto-join new members
                        </span>
                        <p className="text-xs text-muted-foreground">
                            This will automatically invite all members with same
                            e-mail domain to this organization.
                        </p>
                    </label>
                </div>

                {formState.errors?.shouldAttachUsersByDomain && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {formState.errors.shouldAttachUsersByDomain[0]}
                    </p>
                )}
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Save organization'
                )}
            </Button>
        </form>
    )
}