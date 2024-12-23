import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { IoCall } from 'react-icons/io5';

export default function DeveloperCard() {
  return (
    <Card sx={{ maxWidth: 345 }} className='shadow'>
      <CardActionArea className='d-flex'>
        <CardMedia
          component="img"
          height="140"
          image="https://avatars.githubusercontent.com/u/100289747?v=4"
          alt="green iguana"
        />
        <CardContent>
          <Typography className='fw-bold' sx={{ fontSize: "17px" }} gutterBottom variant="h5" component="div">
            Parthiban R
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Have questions or need support? Contact our developers at <br /> <IoCall className='mx-1' color='#9c27b0' size={15} />
            <a href="tel:6383044009">+91 6383044009</a>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
