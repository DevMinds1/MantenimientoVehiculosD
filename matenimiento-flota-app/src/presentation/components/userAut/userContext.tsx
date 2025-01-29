import React, { createContext, useState, ReactNode, useContext } from 'react';

interface User {
  email: string;
  imageUrl: string;
  name: string;
  role: string;
  uid: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  

  const logout = () => {
    setUser(null); 
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
