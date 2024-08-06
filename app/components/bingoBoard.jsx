import styled from "styled-components";

import React, { useState, useEffect } from "react";

export default function BingoBoard({ board }) {
  // Estado para los números marcados
  const [markedNumbers, setMarkedNumbers] = useState([]);

  // Maneja el clic en un número del cartón
  const handleNumberClick = (number) => {
    if (markedNumbers.includes(number)) {
      // Si el número ya está marcado, lo desmarca
      setMarkedNumbers(markedNumbers.filter((n) => n !== number));
    } else {
      // Si el número no está marcado, lo marca
      setMarkedNumbers([...markedNumbers, number]);
    }
  };

  return (
    <StyledBingoCard>
      {Object.keys(board).map((letter) => (
        <div key={letter} className="bingo-column">
          <h2>{letter}</h2>
          {board[letter].map((number, index) => (
            <div
              key={index}
              className={`bingo-cell ${
                markedNumbers.includes(number) ? "marked" : ""
              }`}
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </div>
          ))}
        </div>
      ))}
    </StyledBingoCard>
  );
}

const StyledBingoCard = styled.div`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bingo-column {
    margin: 0 10px;
  }

  .bingo-cell {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    margin: 2px;
  }

  h2 {
    text-align: center;
    margin-bottom: 5px;
  }

  .bingo-cell {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    margin: 2px;
    cursor: pointer;
  }

  .marked {
    position: relative;
  }

  .marked::after {
    content: "";
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #b3000087;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* z-index: -1; */
  }
`;
