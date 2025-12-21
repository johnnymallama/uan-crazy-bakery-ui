"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { useToast } from "@/hooks/use-toast";
import type { getDictionary } from "@/lib/get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['contactForm'];

export function ContactForm({ dictionary: t }: { dictionary: Dictionary }) {
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: t.validation.nameMin }),
    email: z.string().email({ message: t.validation.email }),
    message: z.string().min(10, { message: t.validation.messageMin }).max(500, { message: t.validation.messageMax }),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: t.toast.title,
      description: t.toast.description,
    });
    form.reset();
  }

  if (!t) {
    return null;
  }

  return (
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
                  <FormLabel>{t.email.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.email.placeholder} {...field} />
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
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {t.submit}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
