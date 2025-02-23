"use server";

import LandingPage from "@/components/landing/LandingPage";

export default async function Page() {
  // const user = await currentUser();

  // Redirect to app if user is signed in
  // if (user) {
  //   redirect("/");
  // }

  return <LandingPage />;
}
