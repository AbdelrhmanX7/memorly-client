import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import NextHead from "next/head";
import { KeyIcon } from "@heroicons/react/24/outline";
import { addToast } from "@heroui/react";

import { useForgotPassword } from "@/service/hooks/useAuth";
import { siteConfig } from "@/config/site";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const {
    mutate: forgotPassword,
    isPending,
    isError,
    error,
    isSuccess,
  } = useForgotPassword();

  // Toast notifications
  useEffect(() => {
    if (isPending) {
      addToast({
        description: "Sending reset code to your email...",
        variant: "bordered",
        color: "secondary",
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      addToast({
        description: "Reset code sent! Check your email and enter the code.",
        variant: "bordered",
        color: "success",
        timeout: 4000,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      addToast({
        description:
          error.message || "Failed to send reset code. Please try again.",
        variant: "bordered",
        color: "danger",
        timeout: 4000,
      });
    }
  }, [isError, error]);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");

      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");

      return false;
    }

    setEmailError("");

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    forgotPassword({ email });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

  const pageTitle = "Forgot Password";
  const pageDescription = "Reset your Memorly account password";

  return (
    <>
      <NextHead>
        <title>
          {pageTitle} | {siteConfig.name}
        </title>
        <meta content={pageDescription} name="description" />
        <meta content="noindex, nofollow" name="robots" />
      </NextHead>

      <section className="relative flex h-full items-center justify-center overflow-hidden py-12 px-4">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-background pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <KeyIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-default-500">
              No worries! Enter your email and we&apos;ll send you a reset code.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              autoComplete="email"
              errorMessage={emailError}
              isInvalid={!!emailError}
              label="Email"
              placeholder="Enter your email"
              size="lg"
              type="email"
              labelPlacement="outside"
              value={email}
              variant="bordered"
              onChange={(e) => handleEmailChange(e.target.value)}
            />

            <Button
              className="w-full"
              color="primary"
              isLoading={isPending}
              size="lg"
              type="submit"
            >
              {isPending ? "Sending Code..." : "Send Reset Code"}
            </Button>

            <div className="text-center mt-2">
              <p className="text-small text-default-500">
                Remember your password?{" "}
                <Link as={NextLink} href="/login" size="sm">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
