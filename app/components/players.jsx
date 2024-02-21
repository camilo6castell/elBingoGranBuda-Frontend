import styled from "styled-components";

export default function Players({ players }) {
  return (
    <StyledPlayers>
      <span className="title-players-container">Jugadores en la sala</span>
      {players.map((player) => (
        <span key={player} className="player">
          {player}
        </span>
      ))}
    </StyledPlayers>
  );
}

const StyledPlayers = styled.div`
  & {
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    margin-top: 3rem;
    padding: 2rem;

    border: 1px solid aliceblue;
  }

  .title-players-container {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;
