import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

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
  openAddType: "income" | "expense" | null;
  setOpenAddType: React.Dispatch<
    React.SetStateAction<"income" | "expense" | null>
  >;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [openAddType, setOpenAddType] = useState<"income" | "expense" | null>(
    null
  );



  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        setIsEditOpen,
        isEditOpen,
        active,
        setActive,
        openAddType,
        setOpenAddType,
      }}
    >
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
