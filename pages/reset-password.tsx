import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import NextHead from "next/head";
import { useRouter } from "next/router";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { addToast } from "@heroui/react";

import { useResetPassword } from "@/service/hooks/useAuth";
import { ResetPasswordFormData } from "@/types/auth";
import { siteConfig } from "@/config/site";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { email: queryEmail } = router.query;

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});

  const {
    mutate: resetPassword,
    isPending,
    isError,
    error,
    isSuccess,
  } = useResetPassword();

  // Toast notifications
  useEffect(() => {
    if (isPending) {
      addToast({
        description: "Resetting your password...",
        variant: "bordered",
        color: "secondary",
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      addToast({
        description: "Password reset successfully! Redirecting to login...",
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
          error.message || "Password reset failed. Please try again.",
        variant: "bordered",
        color: "danger",
        timeout: 4000,
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (queryEmail) {
      setFormData((prev) => ({ ...prev, email: queryEmail as string }));
    } else {
      // If no email, redirect to forgot password
      router.push("/forgot-password");
    }
  }, [queryEmail, router]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ResetPasswordFormData, string>> = {};

    // OTP validation
    if (!formData.otp || formData.otp.length !== 6) {
      errors.otp = "Please enter the 6-digit code";
    }

    // Password validation
    if (!formData.newPassword) {
      errors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword: _, ...resetData } = formData;

    resetPassword(resetData);
  };

  const handleChange = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const pageTitle = "Reset Password";
  const pageDescription = "Create a new password for your Memorly account";

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
                <LockClosedIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-default-500">
              Enter the code sent to <strong>{formData.email}</strong>
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              autoComplete="off"
              errorMessage={validationErrors.otp}
              isInvalid={!!validationErrors.otp}
              label="Verification Code"
              labelPlacement="outside"
              maxLength={6}
              placeholder="Enter 6-digit code"
              size="lg"
              type="text"
              value={formData.otp}
              variant="bordered"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                handleChange("otp", value);
              }}
            />

            <Input
              autoComplete="new-password"
              labelPlacement="outside"
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
              errorMessage={validationErrors.newPassword}
              isInvalid={!!validationErrors.newPassword}
              label="New Password"
              placeholder="Enter your new password"
              size="lg"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              variant="bordered"
              onChange={(e) => handleChange("newPassword", e.target.value)}
            />

            <Input
              autoComplete="new-password"
              labelPlacement="outside"
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
              placeholder="Confirm your new password"
              size="lg"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              variant="bordered"
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />

            <Button
              className="w-full"
              color="primary"
              isLoading={isPending}
              size="lg"
              type="submit"
            >
              {isPending ? "Resetting Password..." : "Reset Password"}
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
