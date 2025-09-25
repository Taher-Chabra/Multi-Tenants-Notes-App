import { apiRequest } from "@/utils/requestHandler";

//Login user
const loginUser = async (email: string, password: string) => {
  return await apiRequest("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

// register user
const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  return await apiRequest("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
};

// refresh token
const refreshAccessToken = async () => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
    {
      method: "POST",
      credentials: "include",
    }
  );
};

// logout user
const logoutUser = async () => {
  return await apiRequest("/auth/logout", {
    method: "POST",
  });
};

export { loginUser, registerUser, refreshAccessToken, logoutUser };
