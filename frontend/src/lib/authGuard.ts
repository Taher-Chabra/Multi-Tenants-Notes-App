import { redirect } from "next/navigation";
import { cookies } from "next/headers"

export const authGuard = async () => {
   const cookieStore = await cookies();
   const accessToken = cookieStore.get("accessToken")?.value;

   if (!accessToken) {
      console.error('Unauthorized access. Please log in.');
      redirect('/auth/login');
   }

   return null;
}