"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInSchema, type SignInInput } from "@/features/auth/schemas";
import { useAuthStore } from "@/features/auth/store/auth-store";

const inputClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function LoginForm() {
  const { signIn } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BarChart3 className="h-5 w-5" /></div>
          <CardTitle>Entrar no Lamia Analytics</CardTitle>
          <CardDescription>Use seu e-mail e uma senha com pelo menos 6 caracteres.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit((data) => {
            signIn(data.email);
            router.push("/");
          })} noValidate>
            <label className="grid gap-1.5 text-sm font-medium">E-mail<input className={inputClass} type="email" autoComplete="email" {...register("email")} />{errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}</label>
            <label className="grid gap-1.5 text-sm font-medium">Senha<input className={inputClass} type="password" autoComplete="current-password" {...register("password")} />{errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}</label>
            <Button className="w-full" type="submit" disabled={isSubmitting}>Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
