import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import NextHead from "next/head";
import { useRouter } from "next/router";
import { addToast, Card, CardBody } from "@heroui/react";

import { useLogin } from "@/service/hooks/useAuth";
import { LoginFormData } from "@/types/auth";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const { verified, reset } = router.query;
  const { mutate: login, isPending, isError, error, isSuccess } = useLogin();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    login(formData);
  };

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Toast notifications
  useEffect(() => {
    if (isPending) {
      addToast({
        description: "Signing you in...",
        variant: "bordered",
        color: "secondary",
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      addToast({
        description: "Welcome back! Redirecting to your dashboard...",
        variant: "bordered",
        color: "success",
        timeout: 3000,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      addToast({
        description:
          error.message || "Login failed. Please check your credentials.",
        variant: "bordered",
        color: "danger",
        timeout: 4000,
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (verified === "true") {
      addToast({
        description:
          "Email verified successfully! You can now sign in to your account.",
        variant: "bordered",
        color: "success",
        timeout: 4000,
      });
    } else if (reset === "true") {
      addToast({
        description:
          "Password reset successfully! Please sign in with your new password.",
        variant: "bordered",
        color: "success",
        timeout: 4000,
      });
    }
  }, [verified, reset]);

  const pageTitle = "Sign In";
  const pageDescription =
    "Sign in to your Memorly account and access your precious memories. Secure login to your AI-powered memory companion.";
  const pageKeywords = [
    "login",
    "sign in",
    "log in",
    "user login",
    "account access",
    "memorly login",
  ];

  return (
    <>
      <NextHead>
        <title>
          {pageTitle} | {siteConfig.name}
        </title>
        <meta content={pageDescription} name="description" />
        <meta
          content={[...siteConfig.keywords, ...pageKeywords].join(", ")}
          name="keywords"
        />
        <meta content="noindex, nofollow" name="robots" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
        <meta content={pageTitle} name="twitter:title" />
        <meta content={pageDescription} name="twitter:description" />
      </NextHead>

      <section className="relative flex h-full items-center justify-center overflow-hidden py-12 px-4">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-background pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <ArrowRightStartOnRectangleIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-default-500">Sign in to your Memorly account</p>
          </div>

          <Card className="p-6 shadow-medium">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                autoComplete="email"
                errorMessage={validationErrors.email}
                isInvalid={!!validationErrors.email}
                label="Email"
                labelPlacement="outside"
                placeholder="Enter your email"
                size="lg"
                type="email"
                value={formData.email}
                variant="bordered"
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <Input
                autoComplete="current-password"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-default-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-default-400" />
                    )}
                  </button>
                }
                errorMessage={validationErrors.password}
                isInvalid={!!validationErrors.password}
                label="Password"
                labelPlacement="outside"
                placeholder="Enter your password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                variant="bordered"
                onChange={(e) => handleChange("password", e.target.value)}
              />

              <div className="flex items-center justify-end">
                <Link as={NextLink} href="/forgot-password" size="sm">
                  Forgot password?
                </Link>
              </div>

              <Button
                className="w-full"
                color="primary"
                isLoading={isPending}
                size="lg"
                type="submit"
              >
                {isPending ? "Signing In..." : "Sign In"}
              </Button>

              <p className="text-center text-small text-default-500 mt-2">
                Don&apos;t have an account?{" "}
                <Link as={NextLink} href="/register" size="sm">
                  Sign Up
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
