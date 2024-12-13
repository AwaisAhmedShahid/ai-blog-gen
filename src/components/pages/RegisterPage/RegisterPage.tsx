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
import { signUpFormSchema, signUpFormType } from "./types";
import { useAuthContext } from "@/context/AuthContext";

const defaultValues: signUpFormType = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirm_password: "",
  companyCode: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const { register: handleRegister } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Something went wrong!");

  const methods = useForm<signUpFormType>({
    defaultValues,
    resolver: zodResolver(signUpFormSchema),
    delayError: 500,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (values: signUpFormType) => {
    setIsLoading(true);
    handleRegister({
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      password: values.password,
      confirm_password: values.confirm_password,
    })
      .then((res) => {
        if (!res) {
          setIsError(true);
          setIsLoading(false);
          setErrorMessage("Unable to register. Please try again.");
          return;
        }

        router.replace(PAGE_ROUTES.BLOGS);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen gap-8">
      <h1 className="text-3xl font-extrabold"></h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Enter your email below to login to your account. <br />
              {isError && <span className="text-red-500 text-sm">{errorMessage}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input {...register("first_name")} id="first_name" type="name" placeholder="first name" />
              <Input {...register("last_name")} id="last_name" type="name" placeholder="last name" />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" type="email" placeholder="m@example.com" />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input {...register("password")} id="password" type="password" />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input id="confirm_password" type="password" {...register("confirm_password")} />
              {errors.confirm_password && (
                <span className="text-red-500 text-sm">{errors.confirm_password.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyCode">Company Code</Label>

              <Input id="companyCode" type="password" {...register("companyCode")} />
              {errors.companyCode && <span className="text-red-500 text-sm">{errors.companyCode.message}</span>}
            </div>
          </CardContent>

          <CardFooter>
            <div className="w-full">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoaderCircle size={20} className="animate-spin mr-2" />}

                <span className="ml-2">Sign up</span>
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href={PAGE_ROUTES.LOGIN} className="underline">
                  Login
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
}
