"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified login page
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted">Redirecting to login...</p>
    </div>
  );
}
