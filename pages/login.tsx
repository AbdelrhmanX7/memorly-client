import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import NextHead from "next/head";

import { useLogin } from "@/service/hooks/useAuth";
import { LoginFormData } from "@/types/auth";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const { mutate: login, isPending, isError, error } = useLogin();

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

      <div>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col gap-1 px-6 pt-6">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-small text-default-500">
                Sign in to your Memorly account
              </p>
            </CardHeader>
            <CardBody className="gap-4 px-6 pb-6">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {isError && (
                  <div className="rounded-medium bg-danger-50 p-3 text-small text-danger">
                    {error?.message ||
                      "Login failed. Please check your credentials."}
                  </div>
                )}

                <Input
                  autoComplete="email"
                  errorMessage={validationErrors.email}
                  isInvalid={!!validationErrors.email}
                  label="Email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  variant="bordered"
                  onChange={(e) => handleChange("password", e.target.value)}
                />

                <div className="flex items-center justify-between">
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

                <p className="text-center text-small text-default-500">
                  Don&apos;t have an account?{" "}
                  <Link as={NextLink} href="/register" size="sm">
                    Sign Up
                  </Link>
                </p>
              </form>
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
}
