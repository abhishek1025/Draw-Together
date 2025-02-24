'use client'

import {AuthPage} from '@/components/auth';
import {postRequest, setCookie} from "@/utils";
import {toast} from "@/utils";
import {useRouter} from "next/navigation";


export default function SignIn() {

    const router = useRouter();

    type SignInType = {
        email: string,
        password: string,
    }

    async function handleSignIn (values: SignInType) {

        await toast.promise("Authentication Successful, Welcome back!!!",
            async function (){

               const res = await postRequest({
                    endpoint: '/auth/sign-in',
                    data: values
                })

                if(!res.ok) {
                    throw new Error(res.message)
                }

                const tokenExpiryDate = new Date();

                tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 7)

                setCookie("token", res.data.token, tokenExpiryDate)

                router.push("/")
            }
        );
    }


    return <AuthPage<SignInType> isSignIn handleSubmitAction={handleSignIn} initialValues={{
        email: '',
        password: ''
    }}></AuthPage>;
}
