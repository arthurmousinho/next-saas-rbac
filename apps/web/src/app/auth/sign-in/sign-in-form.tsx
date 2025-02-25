'use client'

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, GithubIcon, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useFormState } from "@/hooks/use-form-state";

import { signInWithEmailAndPassword } from "./actions";
import { signInWithGithub } from "../actions";

export function SignInForm() {

    const [formState, handleSubmit, isPending] = useFormState(signInWithEmailAndPassword);

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

                {formState.success === false && formState.message && (
                    <Alert variant='destructive'>
                        <AlertTriangle className="size-4" />
                        <AlertTitle>Sign in failed!</AlertTitle>
                        <AlertDescription>{formState.message}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input name="email" id="email" type="email" />

                    {formState.errors?.email && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">
                            {formState.errors.email[0]}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" id="password" type="password" />

                    {formState.errors?.password && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">
                            {formState.errors.password[0]}
                        </p>
                    )}

                    <Link
                        href="/auth/forgot-password"
                        className="text-xs font-medium text-foreground hover:underline"
                    >
                        Forgot your password?
                    </Link>
                </div>

                <Button className="w-full" type="submit" disabled={isPending}>
                    {
                        isPending
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : 'Sign in with e-mail'
                    }
                </Button>

                <Button variant={'link'} className="text-sm w-full" asChild>
                    <Link href="/auth/sign-up">Create new account</Link>
                </Button>
            </form>
            
            <Separator orientation="horizontal" />

            <form action={signInWithGithub}>
                <Button
                    className="w-full"
                    variant="outline"
                    type="submit"
                >
                    <GithubIcon />
                    Sign in with GitHub
                </Button>
            </form>
        </div>
    )
}