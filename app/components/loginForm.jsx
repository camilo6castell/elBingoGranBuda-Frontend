"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

import Link from "next/link";

import { useRouter } from "next/navigation";

// CONTEXT
import { useContext } from "react";
import { UserContext } from "../layout";

export default function LoginForm() {
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
  //

  // ESTADO DE FORMULARIO
  const [form, setForm] = useState(initialForm);
  //

  // FORM ************************************************************************************************************************************************

  // INPUTHANDLER
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch(`${process.env.SERVER_HOST}/api/users/`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code) {
            alert(data.message);
          } else {
            const session = JSON.stringify(data.session);
            setUser(JSON.parse(session));
            router.push("/home");
          }
        });
    } catch (error) {
      alert(
        "Hubo un error, contacte al desarollador en cacastellanosh@unal.edu.co con el código del error: ",
        error
      );
    }
  };
  //************************************************************************************************************************************************

  return (
    <StyledForm onSubmit={handleSubmit}>
      <span>Iniciar sesión</span>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        onChange={handleInput}
        value={form.email}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={handleInput}
        value={form.password}
      />
      <button type="submit">Iniciar sesión</button>
      <Link href={"/registry"}>Registrarse</Link>
    </StyledForm>
  );
}

const StyledForm = styled.form`
  & {
    display: flex;
    flex-direction: column;
  }
`;
