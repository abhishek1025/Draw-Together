'use client';

import {toast} from "sonner";

export function success(message: string) {
    toast.success(message);
}

export function error(message: string) {
    toast.error(message);
}

export async function promise<T>(message: string, promise: () => Promise<T>) {

    try {

        toast.promise(promise, {
            loading: 'Loading...',
            success: message,
            error: (error: unknown) => {
                return error instanceof Error ? error.message : 'Something went wrong. Please try again Later.';
            },
        });

    } catch (error) {
        console.log(error);
    }
}