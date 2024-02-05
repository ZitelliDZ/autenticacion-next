"use client";
import { Button, CardWrapper, FormError, FormSuccess } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "@/schemas/auth/RegisterSchema";
import { registerAction } from "@/actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";

export const RegisterForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      registerAction(values).then((res) => {
        if (res.error) {
          setError(res.error);
          setSuccess("");
          return;
        }
        setError("");
        setSuccess(res.success!);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Crea una cuenta"
      backButtonHref="/auth/login"
      backButtonLabel="Ya tienes una cuenta? Inicia sesión"
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 ">
          <div className=" space-y-4 ">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Nombre Completo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="name"
                      placeholder="Mike Daniels "
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="email"
                      placeholder="ejemplo@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
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
            Crea tu cuenta
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
