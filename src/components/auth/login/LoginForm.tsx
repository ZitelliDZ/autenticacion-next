"use client";
import { Button, CardWrapper, FormError, FormSuccess } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas/auth/LoginSchema";
import { loginAction } from "@/actions";

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
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  
  const callbackUrl = searchParams.get("callbackUrl")

  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "El email ya está registrado, inicia sesión con el proveedor" : "";



  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [error, setError] = useState<string|undefined>();
  const [success, setSuccess] = useState<string|undefined>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    
    setError("");
    setSuccess("");
    startTransition(async () => {
      loginAction(values,callbackUrl).then((res) => {
        if (res?.error) {
          form.reset();
          setError(res?.error);
        }
        if (res?.success){
          form.reset();
          setSuccess(res.success);
        }
        if (res?.twoFactor){
          setShowTwoFactor(true);
        }
      }).catch(() => {
        setError('Ocurrió un error inesperado');
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Bienvenido"
      backButtonHref="/auth/register"
      backButtonLabel="No tienes una cuenta? Registrate"
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 ">
          <div className=" space-y-4 ">
            { showTwoFactor && (
              <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="code">Código de autenticación</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="code"
                      placeholder="123456"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            { !showTwoFactor && (
              <>
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
                  <Button variant="link" size={'sm'} asChild className="px-0 font-normal">
                    <Link href="/auth/reset-password">Olvidaste tu contraseña?</Link>
                  </Button>
                </FormItem>
              )}
            />
              </>)}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className=" w-full "
            variant={"default"}
            disabled={isPending}
          >
            {showTwoFactor ? "Confirmar" : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
