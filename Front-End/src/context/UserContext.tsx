import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useUser as useClerkUser } from "@clerk/clerk-react";


interface UserData {
  id: string;
  email: string;
  name: string;
  profile_img: string;
}

interface UserContextType {
  userData: UserData | null;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  isEditOpen: boolean;
  active: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useClerkUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [active, setActive] = useState("dashboard")

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/users/${user.id}`);
        setUserData(res.data); 
        
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [user]);



  return (
    <UserContext.Provider value={{ userData, setIsEditOpen, isEditOpen, active, setActive }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
