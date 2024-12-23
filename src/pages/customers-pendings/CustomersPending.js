import React from 'react'
import CustomBack from '../../components/custom-back/CustomBack'
import { Container } from '@mui/material'
import { Link } from 'react-router-dom'

export default function CustomersPending() {

  const pendingCustomersList = [
    { id: 1, name: "Naveen" },
    { id: 2, name: "Sathish" },
    { id: 3, name: "Yegambaram" },
  ]

  return (
    <>
      <CustomBack title={"Customers Pendings"} />
      <Container sx={{ paddingTop: 6 }}>
        {pendingCustomersList?.map((customer, index) => {
          return (
            <Link to={`/customers-pending/${customer?.name}`} className='shadow text-dark text-decoration-none rounded p-3 my-2 d-flex align-items-center justify-content-between' key={index}>
              <div className='d-flex align-items-center gap-2'>
                <img src="wfre" alt="" />
                <p className='mb-0'>
                  {customer?.name}
                </p>
              </div>
              <p className='mb-0'>$22,331</p>
            </Link>
          )
        })}
      </Container>
    </>
  )
}
