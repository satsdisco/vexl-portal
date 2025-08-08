import { redirect } from 'next/navigation';
import { getUserRole, hasMinimumRole } from '@/lib/auth-helpers';

export default async function RoleCheck({ 
  children,
  minRole = 'ambassador' 
}: { 
  children: React.ReactNode;
  minRole?: 'viewer' | 'ambassador' | 'manager' | 'admin';
}) {
  const role = await getUserRole();
  
  if (!hasMinimumRole(role, minRole)) {
    redirect('/dashboard?error=insufficient-permissions');
  }

  return <>{children}</>;
}