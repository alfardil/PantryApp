import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { SignUp } from "./SignUp";

const Login = ({ onLogin, onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#edd96c"
    >
      <Typography variant="h4" gutterBottom className="space-mono-regular">
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "16px" }}
        InputLabelProps={{
          classes: {
            root: "space-mono-regular",
          },
        }}
        InputProps={{
          classes: {
            input: "space-mono-regular",
          },
        }}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "16px" }}
        InputLabelProps={{
          classes: {
            root: "space-mono-regular",
          },
        }}
        InputProps={{
          classes: {
            input: "space-mono-regular",
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        className="space-mono-regular"
      >
        Login
      </Button>
      {error && (
        <Typography
          color="error"
          className="space-mono-regular"
          style={{ marginTop: "16px" }}
        >
          {error}
        </Typography>
      )}
      <Button
        onClick={onToggle}
        className="space-mono-regular"
        style={{ marginTop: "16px" }}
      >
        {" "}
        Sign up{" "}
      </Button>
    </Box>
  );
};

export default Login;
