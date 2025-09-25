import { refreshAccessToken } from "@/services/auth.service";
import { redirect } from "next/navigation";

const apiRequest = async (url: string, options: RequestInit = {}) => {
   const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
   const response = await fetch(`${baseURL}${url}`, {
      ...options,
      credentials: 'include',
   });

   if (response.status === 401) { 
      const refreshResponse = await refreshAccessToken();
      if (refreshResponse.ok) {
         const retryResponse = await fetch(`${baseURL}${url}`, {
            ...options,
            credentials: 'include',
         });
      } else {
         redirect('/auth/login');
      }
   }

   const data = await response.json().catch(() => null);
   
   if (!response.ok) {
      const message = data?.message || 'An error occurred';
      throw new Error(message);
   }

   return data;
}

export { apiRequest };