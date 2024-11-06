import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start organizing your tasks today
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}