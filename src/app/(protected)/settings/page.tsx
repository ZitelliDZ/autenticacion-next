"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { settings } from "@/actions";
import { Button, FormError, FormSuccess } from "@/components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { SettingsSchema } from "@/schemas/auth/SettingsSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/interfaces/user.interfaces";
import { Switch } from "@/components/ui/switch";

export default function SettingPage() {
  const user = useCurrentUser();
  const { update } = useSession();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((res) => {
          if (res?.error) {
            setError(res.error);
          }
          if (res?.success) {
            update();
            setSuccess(res.success);
          }
        })
        .catch(() => {
          setError("Ocurrió un error inesperado");
        });
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className=" text-2xl font-semibold text-center ">⚙️ Settings</p>
      </CardHeader>
      <CardContent className=" space-y-4 ">
        <Form {...form}>
          <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="name"
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
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
                            id="email"
                            placeholder="jhon@example.com"
                            disabled={isPending}
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
                            id="password"
                            placeholder="*********"
                            disabled={isPending}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="newPassword">
                          Nueva contraseña
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="newPassword"
                            placeholder="*********"
                            disabled={isPending}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role">Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      disabled={isPending}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole[0]}>Usuario</SelectItem>
                        <SelectItem value={UserRole[1]}>
                          Administrador
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                      <div className=" space-y-0.5 ">
                        <FormLabel htmlFor="isTwoFactorEnabled">
                          Autenticación de dos factores
                        </FormLabel>
                        <FormDescription>
                          Activa el factor de autenticación de dos factores para
                          proteger tu cuenta
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id="isTwoFactorEnabled"
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit">Guardar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
