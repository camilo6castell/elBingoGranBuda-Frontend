"use client";

//REGULAR IMPORTS
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS
import NavBar from "../components/navBar";
//

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function App() {
  // ROUTER
  const router = useRouter();

  // SESION HANDLER - context
  const [user, setUser] = useContext(UserContext);

  // CHECK SESSION
  if (!user) {
    router.push("/");
    return null;
  }

  // ESTADO DE JUEGO
  const [game, setGame] = useState(false);
  // CHECK IF PLAYER ON GAME
  const [isOnGame, setIsOnGame] = useState(false);

  // RECONOCIMIENTO DE VARIABLES NECESARIAS PARA EL JUEGO.
  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      checkPlayerOnGame();
      if (user.bingoboard.B.length != 0) {
        router.push("/game");
      }
    }
  }, []);

  const checkPlayerOnGame = () => {
    fetch(`${process.env.SERVER_HOST}/api/users/isongame`, {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("isongame?: ", data.isongame);
        setIsOnGame(data.isongame);
        if (data.isongame) {
          router.push("/game");
        }
      });
  };

  // REDIRECCIONAMIENTO DE LOBBY

  const handleLobby = () => {
    handleGame();
    if (game) {
      if (isOnGame) {
        router.push("/game");
      } else {
        alert(
          "Juego en curso, deberas esperar a que termine el juego en curso para poder unirte a uno nuevo."
        );
      }
    } else {
      setGamePlayer();
    }
  };

  // SABER SI HAY JUEGO EN CURSO
  const handleGame = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/game/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setGame(data.ongame);
        });
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };
  //

  // REDIRECCIONAMIENTO AL LOBBY PARA ESPERA DE COMENZAR EL JUEGO

  // setPlayers

  const setGamePlayer = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/game/`, {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      router.push("/lobby");
    } catch (error) {
      alert(
        "Hubo un error agegando al usuario, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };

  return (
    <StyledApp>
      <NavBar />
      {user ? (
        <button onClick={handleLobby}>¡Iniciar Juego!</button>
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
`;
