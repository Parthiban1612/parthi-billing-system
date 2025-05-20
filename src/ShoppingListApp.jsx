import React, { useState, useEffect } from "react";
import { combinedArray } from "./lib/product-list/productList";

const VoiceToPriceList = () => {
  const [transcript, setTranscript] = useState("");
  const [list, setList] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      alert("Speech recognition not supported");
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsListening(false);

      const lowerText = speechToText.toLowerCase();

      // Try to find the best matching product by checking if its name is included
      const matchedProduct = combinedArray
        .map((product) => ({
          ...product,
          matchIndex: lowerText.indexOf(product.name.toLowerCase()),
        }))
        .filter((p) => p.matchIndex !== -1)
        .sort((a, b) => b.name.length - a.name.length)[0]; // Pick longest name match

      if (matchedProduct) {
        // Extract quantity using regex
        const qtyMatch = lowerText.match(/(\d+)\s*(kg|kilograms)?/);
        const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1; // Default to 1 kg

        const totalPrice = matchedProduct.price * quantity;

        setList((prevList) => [
          ...prevList,
          {
            id: matchedProduct.id + "-" + Date.now(),
            name: matchedProduct.name,
            quantity,
            pricePerKg: matchedProduct.price,
            totalPrice,
            image: matchedProduct.image,
          },
        ]);
      } else {
        alert("No matching product found in the voice input.");
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);


  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript("");
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Voice to Price List</h2>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>

      <div style={{ marginTop: "1rem" }}>
        <b>Transcript:</b> {transcript || "Say product and quantity, e.g. 'Carrot 10 kg'"}
      </div>

      <h3 style={{ marginTop: "1rem" }}>Items List:</h3>
      {list.length === 0 && <p>No items added yet.</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {list.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
            <div>
              <div>
                <strong>{item.name}</strong> - {item.quantity} kg @ ₹{item.pricePerKg} =
                ₹{item.totalPrice}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceToPriceList;
