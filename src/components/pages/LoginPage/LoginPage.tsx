"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postLoginReqSchema, postLoginReqType } from "@/app/api/auth/login/validators";
import { useAuthContext } from "@/context/AuthContext";
import { PasswordInput } from "@/components/common/PasswordInput";

const defaultValues: postLoginReqType = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const methods = useForm<postLoginReqType>({
    defaultValues,
    resolver: zodResolver(postLoginReqSchema),
    delayError: 500,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (values: postLoginReqType) => {
    setIsLoading(true);
    login(values)
      .then((res) => {
        if (!res) {
          setIsError(true);
          return;
        }
        router.replace(PAGE_ROUTES.BLOGS);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen gap-8">
      <h1 className="text-3xl font-extrabold"></h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account. <br />
              {isError && <span className="text-red-500 text-sm">{"Incorrect email or password"}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" type="email" placeholder="m@example.com" />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput {...register("password")} id="password" />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoaderCircle size={20} className="animate-spin mr-2" />}

                <span className="ml-2">Sign in</span>
              </Button>

              <div className="mt-4 text-center text-sm">
                Don{"'"}t have an account?{" "}
                <Link href={PAGE_ROUTES.REGISTER} className="underline">
                  Register
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
}
