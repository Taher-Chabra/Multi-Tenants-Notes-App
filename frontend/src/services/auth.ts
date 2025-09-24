import { apiRequest } from "@/utils/requestHandler";

//Login user

const loginUser = async (email: string, password: string) => {
   return apiRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
   });
};

// register user

const registerUser = async (username: string, email: string, password: string) => {
   return apiRequest('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
   });
}

// refresh token 

const refreshToken = async () => {
   return apiRequest('/auth/refresh-token', {
      method: 'POST'
   });
};

// logout user

const logoutUser = async () => {
   return apiRequest('/auth/logout', {
      method: 'POST'
   });
}

export { loginUser, registerUser, refreshToken, logoutUser };