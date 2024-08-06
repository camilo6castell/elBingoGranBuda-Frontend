"use client";

// REGULAR IMPORTS
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import styled from "styled-components";

// COMPONENTS
import Players from "../components/players";
//

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function App() {
  // SESION HANDLER - context
  const [user, setUser] = useContext(UserContext);

  // ROUTER
  const router = useRouter();

  // CHECK SESSION
  if (!user) {
    router.push("/");
    return null;
  }

  // PLAYERS STATE
  let [players, setPlayers] = useState([]);

  // RECONOCIMIENTO DE VARIABLES NECESARIAS PARA EL JUEGO.

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      if (user.bingoboard.B.length != 0) {
        router.push("/game");
      }
    }
  }, []);
  //

  // TEMPRORIZADOR DE LOBBY --------------------------------------------------------------------------------------------------------------------------

  // GET PLAYERS
  const GetPlayers = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/game/lobby`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPlayers(data.players);
        });
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };

  // LÓGICA TEMPORIZADOR
  // Estado para controlar el tiempo restante
  const [countdown, setCountdown] = useState(60);
  // Función para disminuir el tiempo restante
  const decreaseCountdown = () => {
    setCountdown((prevCountdown) => prevCountdown - 1);
  };
  // Efecto para disminuir el tiempo restante cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      decreaseCountdown();
      GetPlayers();
    }, 1000);
    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------------------------------------------------------------------------------------------------

  // Redireccionamiento a comenzar juego **********************************************************************************************************
  const startGame = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/game/start`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            generateBoard();
            router.push("/game");
          } else {
            router.push("/home");
            alert(
              "Ha ocurrido un error iniciando el juego, comuniquese con el desarrollador al correo cacastellanosh@unal.edu.co"
            );
          }
        });
    } catch (error) {
      console.log("Error en comenzar el juego", error);
    }
  };

  // Lógica para determinar el mensaje a mostrar en el lobby
  let lobbyMessage;
  if (countdown > 30) {
    lobbyMessage = `Esperando a que se unan más jugadores.`;
  } else if (countdown == 0) {
    router.push("/home");
  } else if (countdown > 5 && players.length == 1) {
    lobbyMessage = `Cuando se una al menos un jugador más ¡comenzará el juego!`;
  } else if (countdown > 5 && players.length > 1) {
    startGame();
  } else if (countdown <= 5 && players.length == 1) {
    lobbyMessage = `No se pudieron unir suficientes jugadores a tiempo. Volviendo a la pantalla de 'Home'.`;
  }

  // ****************************************************************************************************************************************

  // CARTON DE BINGO -----------------------------------------------------------------------------------------------------------------------------------------------

  // FUNCIÓN PARA GENERAR CARTÓN DE BINGO Y GUARDARLA EN USUARIO

  const generateBoard = () => {
    // Función para generar un número aleatorio
    const getRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const newBoard = {
      B: [],
      I: [],
      N: [],
      G: [],
      O: [],
    };

    // Genera números únicos para cada letra
    for (let letter in newBoard) {
      while (newBoard[letter].length < 5) {
        const randomNumber = getRandomNumber(
          letter === "B"
            ? 1
            : letter === "I"
            ? 16
            : letter === "N"
            ? 31
            : letter === "G"
            ? 46
            : 61,
          letter === "B"
            ? 15
            : letter === "I"
            ? 30
            : letter === "N"
            ? 45
            : letter === "G"
            ? 60
            : 75
        );

        // Verifica que el número no esté repetido en la columna actual
        if (!newBoard[letter].includes(randomNumber)) {
          newBoard[letter].push(randomNumber);
        }
      }
    }

    // Inserta un espacio vacío en el centro del cartón
    newBoard.N[2] = null;

    try {
      fetch(`${process.env.SERVER_HOST}/api/users/bingoboard/`, {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          bingoboard: newBoard,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code) {
            const user = JSON.stringify(data.user);
            setUser(JSON.parse(user));
            console.log("Cartón de bingo asignado en lobby", user);
          }
        });
    } catch (error) {
      console.log("Error guardando el bingoborad", error);
    }
  };

  // -----------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <StyledApp>
      <div className="message-lobby-container">
        <h1 className="message-lobby">{lobbyMessage}</h1>
        <h2>{`Tiempo restante: ${countdown} segundos.`}</h2>
      </div>

      <Players players={players} />
    </StyledApp>
  );
}

const StyledApp = styled.div`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100dvw;
    height: 100dvh;
  }

  .message-lobby-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    height: 4rem;
  }

  .message-lobby {
    font-weight: 500;
    font-size: 1.4rem;
  }
`;
