import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Theme } from "@radix-ui/themes";
import heroImg from "/home-img.png";
import Minter from "./components/Minter";
import Gallery from "./components/Gallery";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { nft_marketplace_backend } from "../../declarations/nft-marketplace-backend";
import { Principal } from "@dfinity/principal";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [userOwnedGallery, setOwnedGallery] = useState();

  function changeLDMode() {
    setDarkMode(!darkMode);
  }

  async function getOwnedNFTs() {
    const userNFTIDs = await nft_marketplace_backend.getOwnedNFTs(
      Principal.fromText("2vxsx-fae")
    );
    console.log(userNFTIDs);

    setOwnedGallery(<Gallery title={"My NFTs"} ids={userNFTIDs} />);
  }

  useEffect(() => {
    getOwnedNFTs();
  }, []);

  return (
    <Theme appearance={darkMode ? "dark" : "light"}>
      <div className="App">
        <Header mode={darkMode} changeLDMode={changeLDMode} />
        <div className="main">
          <BrowserRouter basename="/">
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <img src={heroImg} className="hero-image" alt="Hero Image" />
                }
              />
              <Route path="/minter" element={<Minter />} />
              <Route path="/discover" element={<Gallery title="Discover" />} />
              <Route path="/collection" element={userOwnedGallery} />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    </Theme>
  );
}

export default App;
