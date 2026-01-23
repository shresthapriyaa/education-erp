"use client";
import { FcGoogle } from "react-icons/fc";      // Google icon
import { FaApple, FaFacebookF } from "react-icons/fa"; // Apple & Facebook
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {

  const {form, onSubmit, loading, showPassword, setShowPassword} = useLogin()
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-11"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11"
                disabled={!form.formState.isValid || loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </CardContent>
        <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => signIn("google",{callbackUrl:"/dashboard"})}
                className="h-11 rounded-lg border flex items-center justify-center"
              >
                <FcGoogle className="h-5 w-5"></FcGoogle>
              </button>
              <button
                type="button"
                onClick={() => signIn("apple")}
                className="h-11 rounded-lg border flex items-center justify-center"
              >
                <FaApple className="h-5 w-5"></FaApple>
              </button>
              <button
                type="button"
                onClick={() => signIn("facebook")}
                className="h-11 rounded-lg border flex items-center justify-center"
              >
                <FaFacebookF className="h-5 w-5"></FaFacebookF>
              </button>
            </div>
      </Card>
    </div>
  );
}