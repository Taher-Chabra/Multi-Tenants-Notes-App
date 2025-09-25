import { authGuard } from "@/lib/authGuard";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await authGuard();
  return children;
};

export default Layout;
