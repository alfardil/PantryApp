'use client'
import Image from "next/image"
import {useState, useEffect} from "react"
import {firestore} from "@/firebase"
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material"
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore"
import './globals.css';

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [quantityInput, setQuantityInput] = useState(1);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + quantityInput})
    }
    else {
      await setDoc(docRef, {quantity: quantityInput})
    }
    await updateInventory()
  }


  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - quantityInput})
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    gap={2}
    bgcolor="#edd96c"
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
        position="absolute" 
        top="50%" 
        left="50%"
        width={400}
        bgcolor="#edd96c"
        border="2px solid #000"
        boxShadow={24}
        px={4}
        display="flex"
        flexDirection="column"
        gap={3}
        padding={5}
        sx={{
          transform: 'translate(-50%,-50%)',
        }}
        > 
          <Typography variant="h6" className="space-mono-regular"> Add Item </Typography>
          <Stack 
          width="100%" 
          direction="row" 
          justifyContent="space-between"
          spacing={2}
          >

            <TextField
            variant="outlined"
            fullWidthvalue={itemName}
            onChange={(e) => {
              setItemName(e.target.value.trim().toLowerCase())
            }}
            />

            <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            className="space-mono-regular"
            >
              Add
            </Button>

          </Stack>

        </Box>

      </Modal>

      <Button 
      variant="contained"
       onClick={()=>{
        handleOpen()
      }}
      className="space-mono-regular"
      >
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box
        width="800px"
        height="100px"
        bgcolor="#edd96c"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >

          <Typography variant="h2" color="#333" className="space-mono-regular">
            Inventory Items
          </Typography>

        </Box>

      <Stack
      width="800px" 
      height="300px" 
      spacing={2} 
      overflow="auto"
      padding={3}
      >
        {
          inventory.map(({name, quantity}) => (
            <Box 
            key={name} 
            width="100%" 
            minHeight="150px" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            bgcolor="#edd96c" 
            padding={3}
            >

              <Typography 
              variant="h3"
              color="#333"
              textAlign="center"
              className="space-mono-regular"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography 
              variant="h3"
              color="#333"
              textAlign="center"
              className="space-mono-regular"
              >
                {quantity}
              </Typography>

            <Stack
            orientation="vertical"
            spacing={1}
            >
              
              <TextField
              id="standard-number"
              label="Enter number:"
              type="number"
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: "input-label",
                }
              }}
              InputProps={{
                classes: {
                  input: "space-mono-regular"
                },
              }}
              variant="standard"
              size="small"
              style={{ width: '200px' }}
              value={quantityInput}
              onChange={(e) => setQuantityInput(Number(e.target.value))}
              />

              <Button
              variant="contained"
              onClick={() => {
                addItem(name);
              }}
              className="space-mono-regular"
              color="success"
              >
                Add
              </Button>

              <Button 
              variant="contained"
              onClick={() => {
                removeItem(name);
              }}
              className="space-mono-regular"
              color="error"
              >
                Remove
              </Button>

              

            </Stack>


            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
  );
}
