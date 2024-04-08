import React from 'react'
import CreateOrderForm from './create-product-form/CreateOrderForm'
import { Container } from '@mui/material'
import CustomBack from '../../components/custom-back/CustomBack'

export default function ProductList() {
  return (
    <>
      <CustomBack title={"Products List"} />
      <Container className='my-2'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint nesciunt tempore cupiditate, assumenda maiores vitae deleniti pariatur asperiores officiis non nam ducimus! Dolore reiciendis recusandae quod ratione aliquid velit provident.
        <CreateOrderForm />
      </Container>
    </>

  )
}
