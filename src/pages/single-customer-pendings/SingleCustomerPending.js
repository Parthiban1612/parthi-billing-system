import React from 'react'
import CustomBack from '../../components/custom-back/CustomBack'
import { useParams } from 'react-router-dom'

export default function SingleCustomerPending() {
  const params = useParams();

  return (
    <>
      <CustomBack title={params?.id} />
    </>
  )
}
