import { SignIn } from '@clerk/nextjs';
import { vexlBrand } from '@/lib/vexl-brand-manual';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: vexlBrand.colors.primary.yellow }}
          >
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your ambassador dashboard
          </p>
        </div>
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}