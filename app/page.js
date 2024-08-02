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
  const [searchInput, setSearchInput] = useState("");

  const capitalizeWords = (str) => {
    return str
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(' '); 
  };
  

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
      
      if (quantity <= 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - quantityInput})
      }
    }

    await updateInventory()
  }

  const clearItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)

    try {
      await deleteDoc(docRef);
      await updateInventory();
      console.log(`Document for item ${item} successfully deleted.`)
    } catch (error) {
      console.error("Error deleting document: ", error);
    }

  }

  useEffect(() => {
    updateInventory();
  }, [])

  

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    
    <Box 
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    bgcolor="#edd96c"
    position="relative"
    alignItems="center"
    >
      <Box
      width="100%"
      display="flex"
      justifyContent="center"
      position="absolute"
      top={0}
      pt={2}
      >
        <Typography 
        variant="h2" 
        color="#333" 
        className="space-mono-regular"
        align="center"
        
        >
            Inventory Items
        </Typography>

      </Box>


      {/* add item pop up */}
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
            InputProps={{
              classes: {
                input: "space-mono-regular",
              }
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
                }
              }}
              variant="standard"
              size="small"
              style={{ width: '200px' }}
              value={quantityInput}
              onChange={(e) => setQuantityInput(Number(e.target.value))}
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


      <Box 
      display="flex"
      flexDirection="column"
      bgcolor="#edd96c"
      justifyContent="center"
      alignItems="center"
      paddingTop={15}
      >
        <Button 
      variant="contained"
       onClick={()=>{
        handleOpen()
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
      top={190}
      >

        <TextField
        id="search-bar"
        label="Search Items"
        variant="outlined"
        size="small"
        style={{ width: '800px', marginTop: '20px' }} 
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
          }
        }}
        />
      
      <Stack
      width="800px" 
      height="65vh" 
      spacing={7.5} 
      overflow="auto"
      padding={3}
      >
        {
          inventory
          .filter(({name}) => name.toLowerCase().includes(searchInput.toLowerCase())) // search functionality
          .map(({name, quantity}) => (
            <Box 
            key={name} 
            width="100%" 
            minHeight="150px" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            bgcolor="#edd96c"
            >

              <Typography 
              variant="h3"
              color="#333"
              textAlign="center"
              className="space-mono-regular"
              >
                {capitalizeWords(name)}
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
            direction="column"
            spacing={1}
            >
              
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
                }
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
                Delete
              </Button>

              <Button
              variant="contained"
              onClick={() => {
                clearItem(name);
              }}
              className="space-mono-regular"
              >
                Clear
              </Button>
              

            </Stack>


            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
  );
}
