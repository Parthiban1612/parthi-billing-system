import React from 'react'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function CustomBack({ title }) {

  const router = useNavigate();

  return (
    <div className='bg-primary p-3 position-relative'>
      <IoArrowBackCircle onClick={() => router(-1)} size={24} className='text-light position-absolute' style={{ left: "20px" }} />
      <p className='text-center text-light fw-bold mb-0'>{title}</p>
    </div>
  )
}
