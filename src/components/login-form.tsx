"use client";
import { Grip } from "lucide-react";
import { login, signup } from "@/app/login/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [openSignup, setOpenSignup] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Grip className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Welcome to Draggie</h1>
            {openSignup ? (
              <div className="text-center text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => setOpenSignup(false)}
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => setOpenSignup(true)}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              {openSignup && (
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              )}
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              formAction={openSignup ? signup : login}
              type="submit"
              className="w-full"
            >
              {openSignup ? "Sign up" : "Login"}
            </Button>
          </div>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <Button variant="outline" type="button" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
