import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import NextHead from "next/head";

import { useRegister } from "@/service/hooks/useAuth";
import { RegisterFormData } from "@/types/auth";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const { mutate: register, isPending, isError, error } = useRegister();

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

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof RegisterFormData, string>> = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        errors.dateOfBirth = "You must be at least 13 years old";
      }
    }

    // Privacy policy validation
    if (!formData.acceptPrivacyPolicy) {
      errors.acceptPrivacyPolicy = "You must accept the privacy policy";
    }

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
    value: string | boolean
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

      <div>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col gap-1 px-6 pt-6">
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-small text-default-500">
                Join Memorly to start your journey
              </p>
            </CardHeader>
            <CardBody className="gap-4 px-6 pb-6">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {isError && (
                  <div className="rounded-medium bg-danger-50 p-3 text-small text-danger">
                    {error?.message || "Registration failed. Please try again."}
                  </div>
                )}

                <Input
                  errorMessage={validationErrors.username}
                  isInvalid={!!validationErrors.username}
                  label="Username"
                  placeholder="Enter your username"
                  type="text"
                  value={formData.username}
                  variant="bordered"
                  onChange={(e) => handleChange("username", e.target.value)}
                />

                <Input
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

                <Input
                  endContent={
                    <button
                      aria-label="toggle confirm password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  variant="bordered"
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                />

                <Input
                  errorMessage={validationErrors.dateOfBirth}
                  isInvalid={!!validationErrors.dateOfBirth}
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  variant="bordered"
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
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

                <p className="text-center text-small text-default-500">
                  Already have an account?{" "}
                  <Link as={NextLink} href="/login" size="sm">
                    Sign In
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
