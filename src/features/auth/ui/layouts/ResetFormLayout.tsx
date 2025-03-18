import { Button } from "@/shared/ui/button";
import { Toaster } from "sonner";

import { Form } from "@/shared/ui/form";
import { UseFormReturn } from "react-hook-form";
import React from "react";
import { ResetPasswordFormData } from "@/entities/user/api/auth-api";

interface ResetFormLayoutProps {
  form: UseFormReturn<
    {
      password?: string;
      email?: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  buttonTitle: string;
  formField: React.ReactElement;
}

export function ResetFormLayout({
  form,
  onSubmit,
  buttonTitle,
  formField,
}: ResetFormLayoutProps) {
  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {formField}
        <Button type="submit">{buttonTitle}</Button>
      </form>
    </Form>
  );
}
