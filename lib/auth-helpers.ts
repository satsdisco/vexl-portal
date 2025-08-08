import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'viewer' | 'ambassador' | 'manager' | 'admin';

export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser();
  if (!user) return 'viewer';
  
  // Get role from publicMetadata
  const role = user.publicMetadata?.role as UserRole | undefined;
  return role || 'viewer';
}

export async function requireRole(minRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return hasMinimumRole(userRole, minRole);
}

export function hasMinimumRole(userRole: UserRole, minRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 0,
    ambassador: 1,
    manager: 2,
    admin: 3,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[minRole];
}

export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}