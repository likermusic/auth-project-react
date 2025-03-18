import { EmailToResetForm } from "@/features/auth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";
import React from "react";

export function ForgotPassword() {
  return <AuthLayout title="Enter email" form={<EmailToResetForm />} />;
}
