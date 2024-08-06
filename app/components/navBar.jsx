"use client";

// REGULAR IMPORTS
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/elBingoGranBuda.png";

import styled from "styled-components";

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function NavBar() {
  // SESION HANDLER - context
  const [user, setUser] = useContext(UserContext);

  // REMOVE USER FROM IS ON GAME

  const removeIsOnGame = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/game/removeplayer/`, {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code) {
            console.log(
              "Eliminado el usuario de isOnGame con éxito.".data.code
            );
          }
        });
    } catch (error) {
      console.log("Error removiendo usuario de isOnGame: ", error);
    }
  };

  const clearsession = () => {
    removeIsOnGame();
    setUser(undefined);
  };
  return (
    <StyledHeader>
      <Link href={"/"}>
        <Image src={logo} width={300} alt="instaya" />
      </Link>
      <div className="menu">
        <nav>
          {user ? (
            <ul>
              <li className="text-nav">
                <Link href={"/"} onClick={clearsession}>
                  Cerrar Sesión
                </Link>
              </li>
              <span>{user.email}</span>
            </ul>
          ) : (
            <ul></ul>
          )}
        </nav>
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  && {
    position: fixed;
    top: 0;
    padding-top: 2rem;

    display: flex;
    justify-content: space-around;
    align-items: center;

    width: 100%;
  }

  img {
    transition: all 0.5s;
  }
  a {
    font-size: 1.5rem;
    color: aliceblue;
    font-weight: 600;
    text-decoration: none;
    margin: 0 2rem;
  }

  .menu {
    display: flex;
    align-items: center;
  }

  .modo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: aquamarine;
    padding: 0.5rem;
    border-radius: 1rem;
    margin: 0 2rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    height: 3rem;

    list-style: none;
    margin: 0 2rem;
  }

  li {
    display: inline-block;
    margin: 0 1rem;
  }

  img:hover {
    transform: scale(1.1);
  }
`;
