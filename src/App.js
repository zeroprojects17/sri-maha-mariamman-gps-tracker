import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [coordinates, setCoordinates] = useState({ lat: null, long: null });

  useEffect(() => {
    const dbRef = ref(database, "/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat !== undefined && data.long !== undefined) {
        setCoordinates({ lat: data.lat, long: data.long });
        loadMap(data.lat, data.long); // Load the map after getting data
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const loadMap = (lat, long) => {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) {
      console.error("Map container not found.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = function () {
      const map = new window.google.maps.Map(mapDiv, {
        center: { lat, lng: long },
        zoom: 15,
      });

      // Add a marker
      new window.google.maps.Marker({
        position: { lat, lng: long },
        map: map,
      });
    };

    document.body.appendChild(script);
  };

  const openInMaps = (platform) => {
    const { lat, long } = coordinates;
    const label = "Current Location"; // Label for the marker
    if (platform === "google") {
      const googleMapsUrl = `https://www.google.com/maps?q=loc:${lat},${long}&label=${label}`;
      window.open(googleMapsUrl, "_blank");
    } else if (platform === "apple") {
      const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${long}&q=${label}`;
      window.open(appleMapsUrl, "_blank");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                textAlign: "center",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                fontFamily: '"Noto Sans Tamil", sans-serif', // Apply Noto Sans Tamil font
                padding: 0,
                margin: 0,
              }}
            >
              {/* Logo and Title */}
              <div
                style={{
                  flex: "0 1 auto",
                  marginBottom: "20px",
                  padding: "10px",
                }}
              >
                <img
                  src="/logo512.png"
                  alt="Logo"
                  style={{
                    width: "200px",
                    height: "160px",
                    objectFit: "contain",
                    marginBottom: "-1px",
                    marginTop: "1px",
                  }}
                />
                <h2
                  style={{
                    margin: 0,
                    fontWeight: "bold", // Apply bold to the title
                    whiteSpace: "normal", // Allow wrapping text
                    fontSize: "24px",
                  }}
                  className="title"
                >
                  ஸ்ரீ மகா மாரியம்மன் தேவஸ்தான சபை ஆலயம் இரத ஊர்வலம் நேரடி இடமறியல் அமைப்பு
                </h2>

                {/* Buttons */}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => openInMaps("google")}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Google Maps
                  </button>
                  <button
                    onClick={() => openInMaps("apple")}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#28A745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Apple Maps
                  </button>
                  <button
                    onClick={() => window.open("/#/app", "_blank")}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#FF5733",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Download App
                  </button>
                </div>
              </div>

              {/* Map Section */}
              <div
                id="map"
                style={{
                  flex: "1 1 auto",
                  width: "100%",
                  height: "100%",
                  position: "relative", // Ensure map stays responsive
                  marginTop: "-20px", // Adjust the top margin here
                }}
              ></div>
            </div>
          }
        />
        {/* /app route with Bootstrap */}
        <Route
          path="/app"
          element={
            <>
              {/* Import Bootstrap CSS here for the /app page */}
              <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
              />
              <div className="container text-center" style={{ paddingTop: "0" }}>
                <div className="row my-3">
                  {/* Left Section */}
                  <div className="col-6 d-flex flex-column align-items-center mb-4">
                    <img
                      src="3.png"
                      alt="Logo"
                      className="img-fluid mb-3"
                      style={{
                        width: "150px", // Fixed width
                        height: "150px", // Fixed height
                        objectFit: "cover", // Ensures the image covers the area
                      }}
                    />
                    <h2 style={{ fontWeight: "bold" }}>வாழ்க வளமுடன்! &nbsp;</h2>
                  </div>

                  {/* Right Section */}
                  <div className="col-6 d-flex flex-column align-items-center mb-4">
                    <img
                      src="4.png"
                      alt="Logo"
                      className="img-fluid mb-3"
                      style={{
                        width: "150px", // Fixed width
                        height: "150px", // Fixed height
                        objectFit: "cover", // Ensures the image covers the area
                      }}
                    />
                    <h2 style={{ fontWeight: "bold" }}>வேல் முருகா வேல்!</h2>
                  </div>
                </div>

                {/* Buttons positioned below left and right sections */}
                <div className="row my-3">
                  {/* Download APK button below left section */}
                  <div className="col-6 d-flex justify-content-center">
                    <button
                      onClick={() =>
                        window.open(
                          "https://www.dropbox.com/scl/fo/y0wdrpqgkaa67h2n0s04v/ACuChpqowZ2lv0oDlmLf7CU?rlkey=tlnct7eawkoudmcvuundej35n&st=o6madij7&dl=0",
                          "_blank"
                        )
                      }
                      className="btn btn-danger"
                    >
                      Download APK
                    </button>
                  </div>

                  {/* Download iOS button below right section */}
                  <div className="col-6 d-flex justify-content-center">
                    <button
                      onClick={() => window.open("/", "_blank")}
                      className="btn btn-success"
                    >
                      Download iOS
                    </button>
                  </div>
                </div>

                {/* Centered Image */}
                <div className="mb-4" style={{ marginTop: "0", marginBottom: "20px" }}>
                  <img
                    src="5.png"
                    alt="Center Image"
                    className="img-fluid"
                    style={{
                      width: "300px",
                      height: "176px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Centered Text */}
                <div className="mt-4" style={{ marginTop: "20px" }}>
                  <h2 style={{ fontWeight: "bold" }}>யாமிருக்க பயமென் !!!</h2>
                  <h2 style={{ fontWeight: "bold" }}>வேலும் மயிலும் துணை</h2>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;