import React from 'react'
import CustomizedButtons from '../../components/CustomizedButtons'
import { Container } from '@mui/material'
import BottomNavigation from '../../components/bottom-nav/BottomNavigation'

export default function ProductList() {
  return (
    <Container>
      <CustomizedButtons name='Create your list' path={"/create-product-list"} />
      <BottomNavigation />
    </Container>
  )
}
