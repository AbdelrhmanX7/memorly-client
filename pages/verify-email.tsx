import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextHead from "next/head";
import { useRouter } from "next/router";
import { CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { addToast, Card } from "@heroui/react";

import { useVerifyEmail, useResendOTP } from "@/service/hooks/useAuth";
import { siteConfig } from "@/config/site";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { email: queryEmail } = router.query;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    mutate: verifyEmail,
    isPending: isVerifying,
    isError: isVerifyError,
    error: verifyError,
    isSuccess: isVerified,
  } = useVerifyEmail();

  const {
    mutate: resendOTP,
    isPending: isResending,
    isSuccess: isResent,
  } = useResendOTP();

  useEffect(() => {
    // Get email from query params or localStorage
    const emailValue =
      (queryEmail as string) ||
      localStorage.getItem("pendingVerificationEmail") ||
      "";

    setEmail(emailValue);

    // If no email, redirect to register
    if (!emailValue && !queryEmail) {
      router.push("/register");
    }
  }, [queryEmail, router]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Start cooldown when OTP is resent
    if (isResent) {
      setResendCooldown(60);
    }
  }, [isResent]);

  // Toast notifications
  useEffect(() => {
    if (isVerifying) {
      addToast({
        description: "Verifying your email...",
        variant: "bordered",
        color: "secondary",
      });
    }
  }, [isVerifying]);

  useEffect(() => {
    if (isVerified) {
      addToast({
        description: "Email verified successfully! Redirecting to login...",
        variant: "bordered",
        color: "success",
        timeout: 3000,
      });
    }
  }, [isVerified]);

  useEffect(() => {
    if (isVerifyError && verifyError) {
      addToast({
        description:
          verifyError.message || "Verification failed. Please try again.",
        variant: "bordered",
        color: "danger",
        timeout: 4000,
      });
    }
  }, [isVerifyError, verifyError]);

  useEffect(() => {
    if (isResending) {
      addToast({
        description: "Sending new verification code...",
        variant: "bordered",
        color: "secondary",
      });
    }
  }, [isResending]);

  useEffect(() => {
    if (isResent) {
      addToast({
        description: "A new verification code has been sent to your email.",
        variant: "bordered",
        color: "success",
        timeout: 4000,
      });
    }
  }, [isResent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return;
    }

    verifyEmail({ email, otp });
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;

    resendOTP({ email });
  };

  const pageTitle = "Verify Email";
  const pageDescription =
    "Verify your email address to activate your Memorly account";

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
          {isVerified ? (
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-20 w-20 text-success mb-4" />
              <h1 className="text-3xl font-bold mb-2">Email Verified!</h1>
              <p className="text-default-500 mb-6">
                Your email has been successfully verified. You can now sign in
                to your account.
              </p>
              <Button
                as={Link}
                className="w-full"
                color="primary"
                href="/login"
                size="lg"
              >
                Continue to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <EnvelopeIcon className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
                <p className="text-default-500">
                  We sent a <span className="text-secondary">6-digit code</span>{" "}
                  to <strong className="text-primary">{email}</strong>
                </p>
              </div>

              <Card className="p-6 shadow-medium">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <Input
                    autoComplete="off"
                    description="Enter the 6-digit code sent to your email"
                    label="Verification Code"
                    labelPlacement="outside"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    size="lg"
                    type="text"
                    value={otp}
                    variant="bordered"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setOtp(value);
                    }}
                  />

                  <Button
                    className="w-full"
                    color="primary"
                    isDisabled={otp.length !== 6}
                    isLoading={isVerifying}
                    size="lg"
                    type="submit"
                  >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </Button>
                </form>
              </Card>
              <div className="text-center mt-4">
                <p className="text-xl font-bold text-warning mb-2">
                  Didn&apos;t receive the code?
                </p>
                <Button
                  color="secondary"
                  isDisabled={resendCooldown > 0}
                  isLoading={isResending}
                  variant="light"
                  onPress={handleResendOTP}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
