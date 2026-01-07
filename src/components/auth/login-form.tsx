'use client';

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Locale } from "../../../i18n-config";
import type { getDictionary } from "@/lib/get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export function LoginForm({ dictionary: t, lang }: { dictionary: Dictionary, lang: Locale }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({
      message: t.loginForm.validation.email,
    }),
    password: z.string().min(8, {
      message: t.loginForm.validation.password,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const { uid } = userCredential.user;

      try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
        });

        if (!response.ok) {
            throw new Error('Failed to create session');
        }

        const { role } = await response.json();

        if (role === 'administrador') {
          router.push(`/${lang}/dashboard/admin`);
        } else if (role === 'consumidor') {
          router.push(`/${lang}/dashboard/consumer`);
        } else {
          router.push(`/${lang}/unauthorized`);
        }

      } catch (backendError) {
        await signOut(auth);
        toast({
          title: t.loginForm.toast.error.title,
          description: t.loginForm.toast.error.description, 
          variant: "destructive",
        });
      }
    } catch (authError) {
      toast({
        title: t.loginForm.toast.error.title,
        description: t.loginForm.toast.error.description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if(!t) return null;

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline" role="heading">{t.loginForm.title}</CardTitle>
        <CardDescription>{t.loginForm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.loginForm.email.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.loginForm.email.placeholder} {...field} />
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
                  <FormLabel>{t.loginForm.password.label}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Cargando...' : t.loginForm.submit}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.loginForm.noAccount}{" "}
          <Link href={`/${lang}/register`} className="font-semibold text-primary hover:underline">
            {t.loginForm.signUp}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
