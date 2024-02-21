"use client";

// REGULAR IMPORTS
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS
import NavBar from "../components/navBar";
import BingoBoard from "../components/bingoBoard";
import Players from "../components/players";
import BingoButton from "../components/bingoButton";
import Ballot from "../components/ballot";
//

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function App() {
  // SESION HANDLER - context
  const [user, setUser] = useContext(UserContext);

  // ROUTER
  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  // CARTÓN DE BINGO STATE
  // const [board, setBoard] = useState({ B: [], I: [], N: [], G: [], O: [] });
  const [board, setBoard] = useState(user.bingoboard);

  // RECONOCIMIENTO DE VARIABLES NECESARIAS PARA EL JUEGO.-----------------------------------------------------------------------------------------------------
  // useEffect(() => {
  //   if (user == undefined) {
  //     router.push("/");
  //   } else {
  //     if (user.bingoboard.B.length == 0) {
  //       router.push("/home");
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      if (user.bingoboard.B.length == 0) {
        router.push("/home");
      }
    }
  }, [user, router]);

  // --------------------------------------------------------------------------------------------------------------------------------------------------------------

  // TODO LO QUE NECESITA EL GAME PARA MANTENERSE FUNCIONANDO

  // GET WINNER
  const [isWinner, setIsWinner] = useState(false);
  const [winner, setWinner] = useState("");

  // GET PLAYERS
  let [players, setPlayers] = useState([]);

  // GET BALLOTAS EN JUEGO
  const [ballotsongame, setBallotsOnGame] = useState([]);

  //

  const GetGame = () => {
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
          setIsWinner(data.iswinner);
          setWinner(data.winner);
          setBallotsOnGame(data.ballotsongame);
          setBoard(user.bingoboard);
        });
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };

  //

  // ACTULIZAR PLAYERS CADA SEGUNDO

  // Efecto para disminuir el tiempo restante cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWinner) {
        DeleteBoard();
        router.push(`/home/${winner}`);
      }
      console.log("*******************************************", isWinner);
      console.log("EL BOARD ACTUAL ES: ", board);
      GetGame();
    }, 1000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  //

  // DELETE BOARD

  const DeleteBoard = () => {
    try {
      fetch(`${process.env.SERVER_HOST}/api/users/deleteboard`, {
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
          if (data.code) {
            console.log("Board eliminado");
          }
        });
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };

  /// REVISAR }}}}}}}}}}}}}}}}}}}}}}}}}}}

  // GET ESTADO DE JUEGO
  // const [game, setGame] = useState(false);

  // const handleGame = () => {
  //   try {
  //     fetch(`${process.env.SERVER_HOST}/api/game/`, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setGame(data.ongame);
  //       });
  //   } catch (error) {
  //     alert(
  //       "Hubo un error, contacte al desarollador al correo cacastellanosh@unal.edu.co con el código del error: ",
  //       error
  //     );
  //   }
  // };
  //

  return (
    <StyledApp>
      <NavBar />
      <Ballot />
      <div className="game-container">
        <div className="board-button">
          <BingoBoard board={board} />
          <BingoButton board={board} ballotsongame={ballotsongame} />
        </div>
        <Players players={players} />
      </div>
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
  .game-container {
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
  }

  .board-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
`;
