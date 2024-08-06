"use client";

// REGULAR IMPORTS
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import styled from "styled-components";

import { useRouter } from "next/navigation";

// COMPONENTS
import Link from "next/link";
import NavBar from "../components/navBar";

//ENCRYPT

const salt = bcrypt.genSaltSync(10);

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function App() {
  // Using context
  const [user, setUser] = useContext(UserContext);
  // REDIRECT
  const router = useRouter();
  //

  // FORM INICIAL VACÍO
  const initialForm = {
    email: "",
    password: "",
  };
  // ESTADO DE FORMULARIO
  const [form, setForm] = useState(initialForm);
  //

  // INPUTHANDLER

  const handleInputRegistry = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE SUBMIT

  const createUser = (e) => {
    e.preventDefault();
    // ENCRIPTACIÓN DE PASSWORD
    const hashedPassword = bcrypt.hashSync(form.password, salt);
    form.password = hashedPassword;
    //
    try {
      fetch(`${process.env.SERVER_HOST}/api/users/registry`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
        });
      router.push("/");
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };

  // REDIRECCIONAMIENTO SI HAY SESIÓN.

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, []);

  return (
    <StyledApp>
      <NavBar />
      <form onSubmit={createUser} className="login-form">
        <span>Registrate!</span>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleInputRegistry}
          value={form.email}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleInputRegistry}
          value={form.password}
        />
        <button type="submit">Registrarse</button>
        <Link href={"/"}>Volver a incio de sesión</Link>
      </form>
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

  .login-form {
    display: flex;
    flex-direction: column;
  }
`;
