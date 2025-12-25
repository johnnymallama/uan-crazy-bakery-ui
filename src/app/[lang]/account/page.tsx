'use client';

import { useSession } from "@/context/session-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home if not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!user) {
    return null; // or a login prompt
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold font-headline">My Account</h1>
      <p className="text-muted-foreground mt-2">This page is under construction. Please check back later.</p>
    </div>
  );
}
