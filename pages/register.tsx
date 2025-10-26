import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import NextHead from "next/head";
import { addToast } from "@heroui/react";

import { useRegister } from "@/service/hooks/useAuth";
import { RegisterFormData } from "@/types/auth";
import { siteConfig } from "@/config/site";
import { validateRegisterForm } from "@/validation/auth";

export default function RegisterPage() {
  const {
    mutate: register,
    isPending,
    isError,
    error,
    isSuccess,
  } = useRegister();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    acceptPrivacyPolicy: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  // Toast notifications
  useEffect(() => {
    if (isPending) {
      addToast({
        description: "Creating your account...",
        variant: "bordered",
        color: "secondary",
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      addToast({
        description: "Account created! Check your email for verification code.",
        variant: "bordered",
        color: "success",
        timeout: 4000,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      addToast({
        description: error.message || "Registration failed. Please try again.",
        variant: "bordered",
        color: "danger",
        timeout: 4000,
      });
    }
  }, [isError, error]);

  const validateForm = (): boolean => {
    const errors = validateRegisterForm(formData);

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword: _, ...registerData } = formData;

    register(registerData);
  };

  const handleChange = (
    field: keyof RegisterFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const pageTitle = "Create Account";
  const pageDescription =
    "Join Memorly and start preserving your precious memories with AI-powered storage. Secure, fast, and encrypted memory keeping made easy.";
  const pageKeywords = [
    "sign up",
    "create account",
    "register",
    "join memorly",
    "new user",
    "memory app signup",
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

      <section className="relative flex items-center justify-center px-4 h-full">
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <UserPlusIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-default-500">
              Join Memorly to start your journey
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {isError && (
              <div className="rounded-large bg-danger-50 p-4 text-small text-danger dark:bg-danger-50/10">
                {error?.message || "Registration failed. Please try again."}
              </div>
            )}

            <Input
              errorMessage={validationErrors.username}
              isInvalid={!!validationErrors.username}
              label="Username"
              labelPlacement="outside"
              placeholder="Enter your username"
              size="lg"
              type="text"
              value={formData.username}
              variant="bordered"
              onChange={(e) => handleChange("username", e.target.value)}
            />

            <Input
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

            <Input
              endContent={
                <button
                  aria-label="toggle confirm password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-default-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-default-400" />
                  )}
                </button>
              }
              errorMessage={validationErrors.confirmPassword}
              isInvalid={!!validationErrors.confirmPassword}
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="Confirm your password"
              size="lg"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              variant="bordered"
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />

            <Input
              errorMessage={validationErrors.dateOfBirth}
              isInvalid={!!validationErrors.dateOfBirth}
              label="Date of Birth"
              labelPlacement="outside"
              size="lg"
              type="date"
              value={formData.dateOfBirth}
              variant="bordered"
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              onClick={(item: any) => item.target.showPicker()}
            />

            <Checkbox
              isInvalid={!!validationErrors.acceptPrivacyPolicy}
              isSelected={formData.acceptPrivacyPolicy}
              size="sm"
              onValueChange={(value) =>
                handleChange("acceptPrivacyPolicy", value)
              }
            >
              <span className="text-small">
                I accept the{" "}
                <Link as={NextLink} href="/privacy" size="sm">
                  Privacy Policy
                </Link>
              </span>
            </Checkbox>
            {validationErrors.acceptPrivacyPolicy && (
              <p className="text-tiny text-danger">
                {validationErrors.acceptPrivacyPolicy}
              </p>
            )}

            <Button
              className="w-full"
              color="primary"
              isLoading={isPending}
              size="lg"
              type="submit"
            >
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>

            <p className="text-center text-small text-default-500 mt-2">
              Already have an account?{" "}
              <Link as={NextLink} href="/login" size="sm">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
