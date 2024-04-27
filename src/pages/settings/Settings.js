import { Container } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@mui/material";
import { RiFileList3Line } from 'react-icons/ri';


export default function Settings() {
  return (
    <Container sx={{ padding: 1 }}>
      <h3>Settings</h3>
      <Button
        className="w-50"
        variant="contained"
        startIcon={<RiFileList3Line />}
        onClick={() => localStorage?.clear()}
      >
        Reset list
      </Button>
      <p></p>
      <Link to={"/about-us"}>About us</Link>
    </Container>
  )
}
