import { ResetPasswordForm } from "@/features/auth";
import { AuthLayout } from "@/shared/ui/layouts/AuthLayout";
import React from "react";

export function ResetPassword() {
  return <AuthLayout title="Reset password" form={<ResetPasswordForm />} />;
}
