const apiRequest = async (url: string, options: RequestInit = {}) => {
   const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
   const response = await fetch(`${baseURL}${url}`, {
      ...options,
      credentials: 'include',
   });

   const data = await response.json().catch(() => null);

   if (!response.ok) {
      const message = data?.message || 'An error occurred';
      throw new Error(message);
   }

   return data;
}

export { apiRequest };