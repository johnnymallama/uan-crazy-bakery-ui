'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from '@/context/location-provider';
import { createUser } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDictionary } from "@/lib/get-dictionary";
import { Loader2 } from 'lucide-react';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface RegisterStepProps {
  dictionary: Dictionary;
  onRegisterSuccess: () => void;
}

export function RegisterStep({ dictionary, onRegisterSuccess }: RegisterStepProps) {
  const { toast } = useToast();
  const { departments, cities, loading: locationLoading } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const t = dictionary.orderWizard.registerStep;
  const sharedValidation = dictionary.registerForm.validation;

  const formSchema = z.object({
    name: z.string().min(1, { message: t.validation.name }),
    email: z.string().email({ message: sharedValidation.email }),
    password: z.string().min(8, { message: sharedValidation.password }),
    confirmPassword: z.string(),
    phone: z.string().min(1, { message: t.validation.phone }),
    address: z.string().min(1, { message: t.validation.address }),
    department: z.string().min(1, { message: t.validation.department }),
    city: z.string().min(1, { message: t.validation.city }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: sharedValidation.passwordMatch,
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", phone: "", address: "", department: "", city: "" },
  });

  const departmentId = useMemo(() => {
    const selectedDept = departments.find(d => d.name === form.watch('department'));
    return selectedDept?.id;
  }, [form.watch('department'), departments]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let firebaseUser = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      firebaseUser = userCredential.user;

      const [firstName, ...lastNameParts] = values.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const userData = {
        id: firebaseUser.uid,
        email: values.email,
        nombre: firstName,
        apellido: lastName || ' ',
        tipo: "consumidor",
        telefono: values.phone,
        direccion: values.address,
        departamento: values.department,
        ciudad: values.city,
      };

      await createUser(userData);

      const sessionResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: firebaseUser.uid }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session after registration');
      }

      toast({ title: dictionary.registerForm.toast.title });
      onRegisterSuccess();

    } catch (error: any) {
      if (firebaseUser) {
        await deleteUser(firebaseUser).catch(deleteError => console.error("Failed to rollback Firebase user:", deleteError));
      }

      let description = dictionary.registerForm.toast.error.generic;
      if (error.code === 'auth/email-already-in-use') {
        description = dictionary.registerForm.toast.error.emailInUse;
      }
      
      toast({ title: dictionary.registerForm.toast.error.title, description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  if (locationLoading) {
    return <div className="flex justify-center items-center h-full min-h-[400px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h3 className="text-lg font-medium text-center">{t.title}</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">{t.description}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>{t.name.label}</FormLabel><FormControl><Input placeholder={t.name.placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>{t.email.label}</FormLabel><FormControl><Input placeholder={t.email.placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>{t.password.label}</FormLabel><FormControl><Input type="password" placeholder={t.password.placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>{t.confirmPassword.label}</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>{t.phone.label}</FormLabel><FormControl><Input placeholder={t.phone.placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>{t.address.label}</FormLabel><FormControl><Input placeholder={t.address.placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>{t.department.label}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t.department.placeholder} /></SelectTrigger></FormControl><SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>{t.city.label}</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!departmentId}><FormControl><SelectTrigger><SelectValue placeholder={t.city.placeholder} /></SelectTrigger></FormControl><SelectContent>{cities.filter(c => c.departmentId === departmentId).map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          <div className="md:col-span-2 mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.submitButton}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
