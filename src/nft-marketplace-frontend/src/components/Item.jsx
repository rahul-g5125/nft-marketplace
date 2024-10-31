import React, { useEffect, useState } from "react";
import { Card, Inset, Box } from "@radix-ui/themes";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import { nft_marketplace_backend } from "../../../declarations/nft-marketplace-backend";
import fetch from "isomorphic-fetch";
import Button from "./Button";

function Item(props) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState("");
  const [button, setButton] = useState("");
  const [princeInput, setPriceInput] = useState("");
  const id = props.id;

  const host =
    process.env.DFX_NETWORK === "local"
      ? "http://ctiya-peaaa-aaaaa-qaaja-cai.localhost:4943/"
      : "https://icp-api.io";
  const agent = new HttpAgent({ fetch, host });

  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  let NFTactor;
  async function loadNFT() {
    // const authClient = await AuthClient.create();
    // const identity = await authClient.getIdentity();

    NFTactor = Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });
    const _name = await NFTactor.getName();

    //console.log(name);

    setName(_name);

    const _owner = await NFTactor.getOwner();
    setName(_name);

    const _imageBytes = await NFTactor.getImage();

    const imageContent = new Uint8Array(_imageBytes);
    const blob = new Blob([imageContent], { type: "image/png" });

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataUrl = event.target.result;
      setImage(dataUrl);
    };
    reader.readAsDataURL(blob);

    setOwner(_owner);

    setButton(<Button handleClick={handleSell} text={"Sell"} />);
  }

  // async function loadNFT() {
  //   const _name = await nft.getName();
  //   const _imageBytes = await nft.getImage();

  //   const _owner = await nft.getOwner();
  //   setName(_name);

  //   const imageContent = new Uint8Array(_imageBytes);
  //   const blob = new Blob([imageContent], { type: "image/png" });

  //   const reader = new FileReader();
  //   reader.onload = function (event) {
  //     const dataUrl = event.target.result;
  //     setImage(dataUrl);
  //   };
  //   reader.readAsDataURL(blob);

  //   setOwner(_owner);
  // }
  let price;
  function handleSell() {
    setPriceInput(
      <input
        placeholder="Price in DRAG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
    console.log("Sell Clicked!");
  }

  async function sellItem() {
    console.log("set price = " + price);
    const status = await nft_marketplace_backend.listItem(
      props.id,
      Number(price)
    );
    console.log("Listing Result: " + status);
    if (status == "success") {
      const result = await NFTactor.transferOwnerShip(
        process.env.CANISTER_ID_NFT_MARKETPLACE_BACKEND
      );
      console.log("Transfer Result: " + result);
    }
  }
  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <Box maxWidth="240px">
      <Card size="2">
        <Inset clip="padding-box" side="top" pb="current">
          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            style={{
              display: "block",
              objectFit: "cover",
              width: "100%",
              height: "auto",
              backgroundColor: "var(--gray-5)",
              border: "solid 2px",
            }}
            src={image}
          />
        </Inset>
        <div>
          <h2>
            {name}
            <span className="purple-text"></span>
          </h2>
          <p>Owner: {owner.toString()}</p>
          {princeInput}
          {button}
        </div>
      </Card>
    </Box>
  );
}

export default Item;
