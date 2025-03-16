"use client";

import { AuthPage } from "@/components/auth/";
import { clientPostRequest, toast } from "@/utils";
import { useRouter } from "next/navigation";

export default function SignUp() {
  type SignUpType = {
    email: string;
    password: string;
    name: string;
  };

  const router = useRouter();

  async function handleSignUp(values: SignUpType) {
    await toast.promise(
      "Your account has been registered!!, Please log in.",
      async function () {
        const res = await clientPostRequest({
          endpoint: "/auth/sign-up",
          data: values,
        });

        if (!res.ok) {
          throw new Error(res.message);
        }

        router.push("/sign-in");
      },
    );
  }

  return (
    <AuthPage<SignUpType>
      isSignIn={false}
      handleSubmitAction={handleSignUp}
      initialValues={{
        email: "",
        password: "",
        name: "",
      }}
    />
  );
}
