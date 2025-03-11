// import { Container } from '@mui/material'
// import React from 'react'
// import { Link } from 'react-router-dom'
// import { Button } from "@mui/material";
// import { RiFileList3Line } from 'react-icons/ri';


// export default function Settings() {
//   return (
//     <Container sx={{ padding: 1 }}>
//       <h3>Settings</h3>
//       <Button
//         className="w-50"
//         variant="contained"
//         startIcon={<RiFileList3Line />}
//         onClick={() => localStorage?.clear()}
//       >
//         Reset list
//       </Button>
//       <p></p>
//       <Link to={"/about-us"}>About us</Link>
//     </Container>
//   )
// }

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DraftsIcon from '@mui/icons-material/Drafts';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function Settings() {

  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem onClick={() => navigate("/all-prices")} className='w-100' disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ReceiptLongIcon />
              </ListItemIcon>
              <ListItemText primary="Update List" />
              <ListItemIcon>
                <KeyboardArrowRightIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ClearAllIcon />
              </ListItemIcon>
              <ListItemText primary="Reset Price List" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
