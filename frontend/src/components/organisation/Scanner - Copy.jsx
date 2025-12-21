import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const url = import.meta.env.VITE_API_BASE_URL;

          const res = await fetch(`${url}/registrations/scan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ ticketId: decodedText })
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.message);
          } else {
            alert("✅ Entry Approved");
          }
        } catch (error) {
          alert("Scan failed");
        }
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h2>Organizer Ticket Scanner</h2>
      <div id="qr-reader" />
    </div>
  );
};

export default Scanner;
