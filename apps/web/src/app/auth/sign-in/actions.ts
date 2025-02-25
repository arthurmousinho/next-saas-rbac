'use server'

import { cookies } from 'next/headers';

import { signInWithPassword } from '@/http/auth/sign-in-with-email-and-password';
import { HTTPError } from 'ky';
import { z } from "zod";
import { redirect } from 'next/navigation';

const signInSchema = z.object({
    email: z.string().email({ message: 'Please, provide a valid e-mail address' }),
    password: z.string().min(1, { message: 'Please, provide your password' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
    const parsing = signInSchema.safeParse(Object.fromEntries(data));

    if (!parsing.success) {
        const errors = parsing.error.flatten().fieldErrors;

        return {
            success: false,
            message: null,
            errors
        }
    }

    const { email, password } = parsing.data;

    try {
        const { token } = await signInWithPassword({ email, password });

        (await cookies()).set('token', token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days 
        });

    } catch (error) {
        if (error instanceof HTTPError) {
            const { message } = await error.response.json();
            return { success: false, message, errors: null }
        }

        console.error(error);
        return {
            success: false,
            message: 'Something went realy wrong, try again in a few minutes',
            errors: null
        }
    }

    redirect('/');
}