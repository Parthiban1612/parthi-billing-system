import { Container } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Settings() {
  return (
    <Container sx={{ padding: 1 }}>
      <h3>Settings</h3>
      <Link to={"/about-us"}>About us</Link>
    </Container>
  )
}
