import { Box, IconButton, Typography } from '@mui/material';
import React from 'react'
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function CustomBack({ title, path }) {

  const router = useNavigate();

  return (
    <Box
      position={'fixed'}
      width={'100%'}
      zIndex={1}
    >
      <Box
        position={'relative'}
        bgcolor={'blue'}
        p={1.5}
      >
        <IconButton
          onClick={() => router(path)}
          sx={{
            position: 'absolute',
            padding: 0
          }}
        >
          <MdArrowBack
            size={23}
            color='white'
          />
        </IconButton>
        <Typography
          color={'white'}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  )
}
