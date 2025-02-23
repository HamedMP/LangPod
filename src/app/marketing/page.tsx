"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import LandingPage from "@/components/landing/LandingPage";

export default async function Page() {
  const user = await currentUser();

  // Redirect to app if user is signed in
  if (user) {
    redirect("/app");
  }

  return <LandingPage />;
}
