import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { ResetFormLayout } from "./layouts/ResetFormLayout";
import { useEmailToReset } from "../model/useEmailToReset";

export function EmailToResetForm() {
  const { emailHandler, form } = useEmailToReset();

  return (
    <ResetFormLayout
      form={form}
      onSubmit={emailHandler}
      buttonTitle="Confirm"
      formField={
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email to reset password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    />
  );
}
