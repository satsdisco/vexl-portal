import UserHeader from '@/components/UserHeader';
import DevRoleBanner from '@/components/DevRoleBanner';

export default function WithAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserHeader />
      <DevRoleBanner />
      {children}
    </>
  );
}