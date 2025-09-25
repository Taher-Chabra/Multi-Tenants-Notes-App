import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getUser } from "@/services/user.service";

interface User {
  _id: string;
  username: string;
  email: string;
  tenantId: {
    _id: string;
    name: string;
  };
  role: string;
}

const UserContext = createContext<{
   user: User | null;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
   return useContext(UserContext)!;
}