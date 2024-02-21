"use client";

// COMPPONENTS

import LoginForm from "./components/loginForm";

// REGULAR IMPORTS

import NavBar from "./components/navBar";
import { useRouter } from "next/navigation";

import styled from "styled-components";
import { useEffect } from "react";

// CONTEXT
import { useContext } from "react";
import { UserContext } from "./layout";

export default function App() {
  // Using Context
  const [user, setUser] = useContext(UserContext);

  // REDIRECCIONAMIENTO
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    } else {
      router.push("/");
    }
  }, []);

  //

  return (
    <StyledApp>
      <NavBar />
      <LoginForm />
    </StyledApp>
  );
}

const StyledApp = styled.div`
  & {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100dvw;
    height: 100dvh;
  }
`;
