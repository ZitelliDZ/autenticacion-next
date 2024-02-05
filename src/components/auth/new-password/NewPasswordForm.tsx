"use client";
import { Button, CardWrapper, FormError, FormSuccess } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResetPassword, SendEmailResetPassword } from "@/actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use, useState, useTransition } from "react";
import { ResetPasswordSchema } from "@/schemas/auth/ResetPassword";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    
    setError("");
    setSuccess("");
    startTransition(async () => {
      if (!token) {
        setError("Token no encontrado");
        return;
      };
      ResetPassword(values,token).then((res) => {
        if (res?.error) {
          setError(res?.error);
        }
        if (res?.success){
          setSuccess(res?.success);
        }
      })
    });
  };

  return (
    <CardWrapper
      headerLabel="Establece nueva contraseña"
      backButtonHref="/auth/login"
      backButtonLabel="Volver a iniciar sesión"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 ">
          <div className=" space-y-4 ">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="password"
                      placeholder="*********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className=" w-full "
            variant={"default"}
            disabled={isPending}
          >
            Establecer nueva contraseña
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
