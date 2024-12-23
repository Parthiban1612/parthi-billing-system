import CustomBack from '../../components/custom-back/CustomBack'
import ReactToPrint from "react-to-print";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { FunctionalComponentToPrint } from './ComponentToPrint';
import LinearProgress from '@mui/material/LinearProgress';
import { FaDownload } from 'react-icons/fa';

export default function ConfirmBill() {

  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef(null);

  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("old boring text");

  const [totalPrice, setTotalPrice] = useState(0);

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log("`onBeforeGetContent` called");
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));

  const reactToPrintTrigger = useCallback(() => {
    return <Button
      disabled={loading} variant="contained"
      className="w-100 mb-2 d-none"
      color="secondary"
      startIcon={<FaDownload />}
    >
      Download as PDF
    </Button>
  }, []);

  const [purchasedItems, setPurchasedItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(purchasedItems) && purchasedItems.length > 0) {
      const total = purchasedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
      localStorage.setItem("currentBill", JSON.stringify(purchasedItems));
    }
  }, [purchasedItems]);


  useEffect(() => {
    const storedCombinedArray = JSON.parse(localStorage.getItem("currentBill"));
    setPurchasedItems(storedCombinedArray || []);
  }, []);

  return (
    <>
      <CustomBack path={"/create-bill"} title={"Share your generated bill"} />
      <Container className='p-0'>
        <Box pt={6}>
          <ReactToPrint
            content={reactToPrintContent}
            documentTitle="AwesomeFileName"
            onAfterPrint={handleAfterPrint}
            onBeforeGetContent={handleOnBeforeGetContent}
            onBeforePrint={handleBeforePrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
          />
          {loading &&
            <div className='my-3'>
              <LinearProgress />
            </div>
          }
          <FunctionalComponentToPrint ref={componentRef} totalPrice={totalPrice} />
        </Box>
      </Container>
    </>
  )
}
