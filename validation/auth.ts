import type {
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "@/types/auth";

/**
 * Validates email format using regex
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  return undefined;
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return undefined;
};

/**
 * Validates password confirmation matches
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
};

/**
 * Validates username
 */
export const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  return undefined;
};

/**
 * Validates date of birth (minimum age requirement)
 */
export const validateDateOfBirth = (
  dateOfBirth: string,
  minAge: number = 13
): string | undefined => {
  if (!dateOfBirth) {
    return "Date of birth is required";
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (age < minAge) {
    return `You must be at least ${minAge} years old`;
  }

  return undefined;
};

/**
 * Validates OTP code (6 digits)
 */
export const validateOTP = (otp: string): string | undefined => {
  if (!otp || otp.length !== 6) {
    return "Please enter the 6-digit code";
  }
  return undefined;
};

/**
 * Validates privacy policy acceptance
 */
export const validatePrivacyPolicy = (
  accepted: boolean
): string | undefined => {
  if (!accepted) {
    return "You must accept the privacy policy";
  }
  return undefined;
};

/**
 * Validates the entire login form
 */
export const validateLoginForm = (
  formData: LoginFormData
): Partial<Record<keyof LoginFormData, string>> => {
  const errors: Partial<Record<keyof LoginFormData, string>> = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Validates the entire registration form
 */
export const validateRegisterForm = (
  formData: RegisterFormData
): Partial<Record<keyof RegisterFormData, string>> => {
  const errors: Partial<Record<keyof RegisterFormData, string>> = {};

  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const dateOfBirthError = validateDateOfBirth(formData.dateOfBirth);
  if (dateOfBirthError) errors.dateOfBirth = dateOfBirthError;

  const privacyPolicyError = validatePrivacyPolicy(
    formData.acceptPrivacyPolicy
  );
  if (privacyPolicyError) errors.acceptPrivacyPolicy = privacyPolicyError;

  return errors;
};

/**
 * Validates the reset password form
 */
export const validateResetPasswordForm = (
  formData: ResetPasswordFormData
): Partial<Record<keyof ResetPasswordFormData, string>> => {
  const errors: Partial<Record<keyof ResetPasswordFormData, string>> = {};

  const otpError = validateOTP(formData.otp);
  if (otpError) errors.otp = otpError;

  const passwordError = validatePassword(formData.newPassword);
  if (passwordError) errors.newPassword = passwordError;

  const confirmPasswordError = validatePasswordMatch(
    formData.newPassword,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};
