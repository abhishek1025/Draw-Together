"use client";

import { AuthPage } from "@/components/auth";
import { clientPostRequest, toast } from "@/utils";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  type SignInType = {
    email: string;
    password: string;
  };

  async function handleSignIn(values: SignInType) {
    await toast.promise(
      "Authentication Successful, Welcome back!!!",
      async function () {
        const res = await clientPostRequest({
          endpoint: "/auth/sign-in",
          data: values,
        });

        if (!res.ok) {
          throw new Error(res.message);
        }

        localStorage.setItem("user", JSON.stringify(res.data.user));

        router.push("/");
      },
    );
  }

  return (
    <AuthPage<SignInType>
      isSignIn
      handleSubmitAction={handleSignIn}
      initialValues={{
        email: "",
        password: "",
      }}
    ></AuthPage>
  );
}
