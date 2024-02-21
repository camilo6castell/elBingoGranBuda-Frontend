// REGULAR IMPORTS

import { useState, useEffect } from "react";
import styled from "styled-components";

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function Ballot() {
  // SESION HANDLER - context
  const [user, setUser] = useContext(UserContext);

  const [number, setNumber] = useState(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const fetchRandomNumber = async () => {
      try {
        fetch(`${process.env.SERVER_HOST}/api/game/getballot`, {
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
            setNumber(data.ballot);
            setCounter(counter + 1);
          });
      } catch (error) {
        console.error("Error fetching random number:", error);
      }
    };

    // Llamar a la función fetchRandomNumber cada 5 segundos y detener después de 75 veces
    if (counter < 75) {
      const intervalId = setInterval(fetchRandomNumber, 5000);
      return () => clearInterval(intervalId);
    }
  }, [counter]);

  return (
    <StyledBall>
      <h2>Balota de Bingo</h2>
      {number && <div className="number">{number}</div>}
    </StyledBall>
  );
}

const StyledBall = styled.div`
  & {
    text-align: center;
  }

  .number {
    position: relative;
    font-size: 4rem;
    font-weight: bold;
    color: #ffffff;
    margin-top: 10px;
    padding: 10px;
    border: 2px solid #272727;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    line-height: 100px;

    background: linear-gradient(45deg, #fbb51f, #99912c, #c7cc32);
  }

  /* @keyframes circleRotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  } */
`;
