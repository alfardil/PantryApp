import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const TopBar = ({ user, onLogout }) => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#a45ab8" }}>
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h6"
          style={{ flexGrow: 1 }}
          className="space-mono-regular"
        >
          Inventory Management
        </Typography>
        {user ? (
          <Box display="flex" alignItems="center" style={{ flexWrap: "wrap" }}>
            <Typography
              variant="body1"
              style={{ marginRight: "16px" }}
              className="space-mono-regular"
            >
              Hello, {user.email}
            </Typography>
            <Button
              color="inherit"
              onClick={onLogout}
              className="space-mono-regular"
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" className="space-mono-regular">
            Please log in to manage inventory
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
