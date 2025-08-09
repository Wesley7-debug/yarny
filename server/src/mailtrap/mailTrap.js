import { MailtrapClient } from "mailtrap";
import { config } from "dotenv";
import {
  ResetPasswordEmail,
  WelcomeEmail,
  PasswordResetConfirmationEmail,
  VerificationEmail,
} from "./mailtrapEmails.js";

config();

const TOKEN = process.env.MAILTRAP_APITOKEN;

const client = new MailtrapClient({ token: TOKEN });

const sender = {
  email: "hello@demomailtrap.co",
  name: "Wesley The Developer",
};
export const sendVerificationEmail = async (
  toEmail,
  username,
  verificationToken
) => {
  // const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`; // Replace with actual frontend URL
  const verifyLink = `${process.env.BASE_URL}/VerifySuccess?token=${verificationToken}`;
  try {
    const response = await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: "Verify Your Email for Yarny",
      html: VerificationEmail(verifyLink, username),
      category: "Email Verification",
    });

    console.log("Verification email sent:", response);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
};

export const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const response = await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: "Welcome to Yarny! 🎉",
      html: WelcomeEmail(name),
      category: "User Onboarding",
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendResetPasswordEmail = async (toEmail, resetToken, username) => {
  const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}`;

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: "Reset Your Password",
      html: ResetPasswordEmail(resetLink, username),
      category: "Password Reset",
    });

    console.log("Password reset email sent:", response);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
};
export const sendPasswordResetConfirmationEmail = async (toEmail, username) => {
  try {
    await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: "Your Yarny Password Was Changed",
      html: PasswordResetConfirmationEmail(username),
      category: "Password Reset Confirmation",
    });

    console.log("Password reset confirmation email sent.");
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
};
