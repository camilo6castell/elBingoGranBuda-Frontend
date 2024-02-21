"use client";

// regular imports
import { createContext, useState } from "react";
import { Inter } from "next/font/google";

// Styles
import "./lib/globals.css";

// Font
const inter = Inter({ subsets: ["latin"] });

// Context
export const UserContext = createContext();
//

export default function RootLayout({ children }) {
  const [user, setUser] = useState(undefined);

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContext.Provider value={[user, setUser]}>
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
