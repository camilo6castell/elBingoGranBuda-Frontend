"use client";

// REGULAR IMPORTS
import styled from "styled-components";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

// COMPONENTS
import NavBar from "@/app/components/navBar";
//

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../../layout";
//

export default function App({ params }) {
  // ROUTER
  const router = useRouter();

  // SESION HANDLER - context
  const [user, setUser] = useContext(UserContext);

  // CHECK SESSION
  if (!user) {
    router.push("/");
    return null;
  }

  // RECONOCIMIENTO DE VARIABLES NECESARIAS PARA EL JUEGO.

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    // TIEMPO PARA QUE EL SISTEMA CIERRE TODOS LOS JUEGOS
    const timeoutId = setTimeout(resetGame, 3000);
    // Cleaning
    return () => clearTimeout(timeoutId);
  }, []);
  //

  // FUNCIÓN RESETEAR GAME

  const resetGame = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/game/resetgame`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Todo en reset :)");
        });
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };
  //

  // END MESSAGE

  let endMessage;
  if (params.end == "w") {
    endMessage = `¡Felicitaciones, has ganado el Bingo!`;
  } else if (params.end == "d") {
    endMessage = `Has sido descalificado, haz presionado el botón de ¡BINGO! pero tu cartón no ha ganado.`;
  } else {
    endMessage = `El jugador ${params.end} ha ganado, ¡felicitaciones a nuestro ganador!`;
  }

  //

  return (
    <StyledApp>
      <NavBar />
      <div className="end-container">
        <span className="end-message">{endMessage}</span>
      </div>
      {user ? (
        <button onClick={resetGame}>
          <Link href={"/home"}>Volver a Home </Link>
        </button>
      ) : (
        <span>Acceso no autorizado</span>
      )}
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

  .end-container {
    display: flex;
    flex-direction: column;

    height: 8rem;
  }

  .end-message {
    font-size: 2rem;
  }
`;
