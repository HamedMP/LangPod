import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-6">
      <p className="text-2xl font-bold text-primary">LangPod</p>

      <SignIn />
    </div>
  );
}
