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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: {children: ReactNode }) => {
  const { user } = useClerkUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  console.log("userId", user);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/users/${user.id}`);
        setUserData(res.data); // update context with db data
        console.log("mano", res.data);

      } catch (error) {
        console.error("Error fetching user:", error);

        setUserData({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.fullName ?? "",
          profile_img: user.imageUrl ?? "",
        });
      }
    };

    fetchUser();
  }, [user]);


  return (
    <UserContext.Provider value={{ userData }}>
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
