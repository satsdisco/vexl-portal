import { SignUp } from '@clerk/nextjs';
import { vexlBrand } from '@/lib/vexl-brand-manual';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: vexlBrand.colors.primary.yellow }}
          >
            Join Vexl Portal
          </h1>
          <p className="text-gray-400">
            Create your account to become a Vexl ambassador
          </p>
        </div>
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/onboarding"
        />
      </div>
    </div>
  );
}