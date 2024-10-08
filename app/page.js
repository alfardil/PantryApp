"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";
import "./globals.css";
import TopBar from "./TopBar";
import Login from "./Login";
import SignUp from "./SignUp";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [quantityInput, setQuantityInput] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const updateInventory = async () => {
    if (!user) return;

    const userDocRef = doc(firestore, "users", user.uid);
    const inventoryCollectionRef = collection(userDocRef, "inventory");
    const snapshot = await getDocs(inventoryCollectionRef);

    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Fetched inventory: ", inventoryList);

    setInventory(inventoryList);

  };

  const addItem = async (item) => {
    if (!user) return;

    const userDocRef = doc(firestore, "users", user.uid);
    const inventoryCollectionRef = collection(userDocRef, "inventory");
    const docRef = doc(inventoryCollectionRef, item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + quantityInput });
    } else {
      await setDoc(docRef, { quantity: quantityInput });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!user) return;

    const userDocRef = doc(firestore, "users", user.uid);
    const inventoryCollectionRef = collection(userDocRef, "inventory");
    const docRef = doc(inventoryCollectionRef, item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity <= 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - quantityInput });
      }
    }

    await updateInventory();
  };

  const clearItem = async (item) => {
    const userDocRef = doc(firestore, "users", user.uid);
    const inventoryCollectionRef = collection(userDocRef, "inventory");
    const docRef = doc(inventoryCollectionRef, item);

    try {
      await deleteDoc(docRef);
      await updateInventory();
      console.log(`Document for item ${item} successfully deleted.`);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        updateInventory();
      }
    });
    return () => unsubscribe();
  }, [updateInventory, user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setInventory([]);
  };

  const isMobile = useMediaQuery("(max-width:600px");

  if (!user) {
    return isLogin ? (
      <Login
        onLogin={() => updateInventory()}
        onToggle={() => setIsLogin(false)}
      />
    ) : (
      <SignUp
        onSignUp={() => updateInventory()}
        onToggle={() => setIsLogin(true)}
      />
    );
  }
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#edd96c"
      position="relative"
      alignItems="center"
      paddingTop={isMobile ? 8 : 10}
    >
      <TopBar user={user} onLogout={handleLogout} />

      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        pt={isMobile ? 2 : 2}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          color="#333"
          className="space-mono-regular"
          align="center"
        >
          Inventory
        </Typography>
      </Box>

      {/* add item pop up */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={isMobile ? "90%" : 400}
          bgcolor="#edd96c"
          border="2px solid #000"
          boxShadow={24}
          px={4}
          display="flex"
          flexDirection="column"
          gap={3}
          padding={5}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6" className="space-mono-regular">
            {" "}
            Add Item{" "}
          </Typography>
          <Stack
            width="100%"
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
            spacing={2}
          >
            <TextField
              variant="outlined"
              fullWidthvalue={itemName}
              onChange={(e) => {
                setItemName(e.target.value.trim().toLowerCase());
              }}
              InputProps={{
                classes: {
                  input: "space-mono-regular",
                },
              }}
            />

            <TextField
              id="standard-number"
              label="Enter number:"
              type="number"
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
              variant="standard"
              size="small"
              style={{ width: "200px" }}
              value={quantityInput}
              onChange={(e) => setQuantityInput(Number(e.target.value))}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              className="space-mono-regular"
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        display="flex"
        flexDirection="column"
        bgcolor="#edd96c"
        justifyContent="center"
        alignItems="center"
        width="100%"
        padding={isMobile ? 5 : 3}
        position="relative"
      >
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}
          className="space-mono-regular"
          alignItems="center"
        >
          Add New Item
        </Button>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        bgcolor="#edd96c"
        position="absolute"
        mt={20}
        width="100%"
        paddingBottom={5}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          paddingBottom={2}
        >
          <TextField
            id="search-bar"
            label="Search Items"
            variant="outlined"
            size="small"
            style={{ width: "50%", marginTop: "20px" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
        </Box>
        <Stack
          width={isMobile ? "75%" : "80%"}
          height={isMobile ? "100vh" : "60vh"}
          spacing={isMobile ? 7 : 15}
          overflow="auto"
          paddingTop={5}
          margin="auto"
        >
          {inventory
            .filter(
              ({ id }) =>
                id && id.toLowerCase().includes(searchInput.toLowerCase())
            ) // search functionality
            .map(({ id, quantity }) => (
              <Box
                key={id}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#edd96c"
                padding={1}
                flexDirection={isMobile ? "column" : "row"}
              >
                <Typography
                  variant="h5"
                  color="#333"
                  textAlign="center"
                  className="space-mono-regular"
                >
                  {capitalizeWords(id)}
                </Typography>

                <Typography
                  variant="h5"
                  color="#333"
                  textAlign="center"
                  className="space-mono-regular"
                >
                  {quantity}
                </Typography>

                {/* buttons on the right side */}
                <Stack direction="column" spacing={1}>
                  <TextField
                    id="standard-number"
                    label="Enter number:"
                    type="number"
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
                    variant="standard"
                    size="small"
                    style={{ width: "200px" }}
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(Number(e.target.value))}
                  />

                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(id);
                    }}
                    className="space-mono-regular"
                    color="success"
                  >
                    Add
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(id);
                    }}
                    className="space-mono-regular"
                    color="error"
                  >
                    Delete
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      clearItem(id);
                    }}
                    className="space-mono-regular"
                  >
                    Clear
                  </Button>

                  <br></br>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
