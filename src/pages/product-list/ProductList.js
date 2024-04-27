import React from 'react'
import CustomizedButtons from '../../components/CustomizedButtons'
import { Container } from '@mui/material'

export default function ProductList() {
  return (
    <Container sx={{ padding: 1 }}>
      <CustomizedButtons name='Create your list' path={"/create-product-list"} />
    </Container>
  )
}
