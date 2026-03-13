"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { CheckCircle2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { getDictionary } from "@/lib/get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["contactForm"];

export function ContactForm({
  dictionary: t,
  lang,
}: {
  dictionary: Dictionary;
  lang: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: t.validation.nameMin }),
    email: z.string().email({ message: t.validation.email }),
    message: z
      .string()
      .min(10, { message: t.validation.messageMin })
      .max(500, { message: t.validation.messageMax }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit() {
    setOpen(true);
    form.reset();
  }

  function handleClose() {
    setOpen(false);
    router.push(`/${lang}`);
  }

  if (!t) return null;

  return (
    <>
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.name.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.name.placeholder} {...field} />
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
                    <FormLabel>{t.email_field.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.email_field.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.message.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.message.placeholder}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t.submit}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center gap-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <DialogTitle className="font-headline text-2xl">
              {t.toast.title}
            </DialogTitle>
            <DialogDescription>{t.toast.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
              {t.toast.backToHome}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
