import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const SignUp = ({ onSignUp, onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignUp();
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
        Sign Up
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
      <Button variant="contained" className="space-mono-regular" onClick={handleSignUp}>
        Sign Up
      </Button>
      {error && (
        <Typography color="error" style={{ marginTop: "16px" }}>
          {error}
        </Typography>
      )}
      <Button
        onClick={onToggle}
        className="space-mono-regular"
        style={{ marginTop: "16px" }}
      >
        {" "}
        Have an account? Log in{" "}
      </Button>
    </Box>
  );
};

export default SignUp;
