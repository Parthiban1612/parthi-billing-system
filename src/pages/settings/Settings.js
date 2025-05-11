
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};

export default function Settings() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p style={{ fontSize: "14px" }} className='text-mute'>
              Are you sure you want to reset? After resetting, your price will revert to the default
            </p>
            <div className='float-end'>
              <Button
                size='small'
                variant="contained"
                color="primary"
                onClick={() => {
                  localStorage.clear();
                  handleClose();
                  toast.success("Your list updated successfully.")
                }}
                sx={{ marginRight: 2 }}
              >
                Reset
              </Button>
              <Button
                size='small'
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem onClick={() => navigate("/products-list")} className='w-100' disablePadding>
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

          <ListItem disablePadding
            onClick={handleOpen}
          >
            <ListItemButton>
              <ListItemIcon>
                <ClearAllIcon />
              </ListItemIcon>
              <ListItemText primary="Reset Price List" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/about-us")}>
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="About us" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
