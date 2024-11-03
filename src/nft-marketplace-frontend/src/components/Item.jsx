import React, { useEffect, useState } from "react";
import {
  Card,
  Inset,
  Box,
  Heading,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { nft_marketplace_backend } from "../../../declarations/nft-marketplace-backend";
import fetch from "isomorphic-fetch";
import Sell from "./Sell";
import { Principal } from "@dfinity/principal";
import PriceLabel from "./PriceLabel";
import { idlFactory as dtokenIDLFactory } from "../../../declarations/dtoken_backend";

function Item(props) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState("");
  const [button, setButton] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [loader, setLoader] = useState(false);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState();
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);
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
    NFTactor = Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });
    const _name = await NFTactor.getName();

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

    if (props.role == "collection") {
      const NFTisListed = await nft_marketplace_backend.isListed(id);
      if (NFTisListed) {
        setOwner("Drag Race");
        setBlur({ filter: "blur(4px)" });
        setSellStatus("Listed");
      } else {
        setButton(<Sell handleClick={handleSell} text={"Sell"} />);
      }
    } else if (props.role == "discover") {
      const originalOwner = await nft_marketplace_backend.getOriginalOwner(id);
      if (originalOwner.toString() != "2vxsx-fae") {
        setButton(<Sell handleClick={handleBuy} text="Buy" />);
      }
      const price = await nft_marketplace_backend.getListedNFTPrice(id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
    }
  }

  let price;

  async function handleBuy() {
    console.log("Buy is triggered");
    setLoader(true);
    const tokenActor = await Actor.createActor(dtokenIDLFactory, {
      agent,
      canisterId: Principal.fromText("a3shf-5eaaa-aaaaa-qaafa-cai"),
    });

    const sellerId = await nft_marketplace_backend.getOriginalOwner(id);
    const itemPrice = await nft_marketplace_backend.getListedNFTPrice(id);
    const result = await tokenActor.transfer(sellerId, itemPrice);

    if (result == "Success") {
      const transferResult = await nft_marketplace_backend.completePurchase(
        id,
        sellerId,
        Principal.fromText("2vxsx-fae")
      );
      console.log("Transfer Result: " + transferResult);
    }
    setDisplay(false);
    setLoader(false);
  }
  function handleSell() {
    setPriceInput(
      <TextField.Root
        placeholder="Price in DRAG"
        type="number"
        value={price}
        style={{ marginTop: "10%", marginBottom: "4%" }}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Sell handleClick={sellItem} text={"Confirm"} />);

    console.log("Sell Clicked!");
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoader(true);
    console.log("set price = " + price);
    const status = await nft_marketplace_backend.listItem(
      props.id,
      Number(price)
    );
    console.log("Listing Result: " + status);
    if (status == "Success") {
      const result = await NFTactor.transferOwnerShip(
        Principal.fromText(process.env.CANISTER_ID_NFT)
      );
      console.log("Transfer Result: " + result);
    }
    setLoader(false);

    setButton("");
    setPriceInput("");
    setOwner("Drag Race");
  }
  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <Box style={{ display: shouldDisplay ? "inline" : "none" }}>
      <Card size="5" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
        <Inset clip="padding-box" side="top" pb="current">
          <img
            style={{
              blur,
              display: "block",
              objectFit: "cover",
              width: "100%",
              height: "auto",
            }}
            src={image}
          />
        </Inset>
        <Heading>{name}</Heading>
        {priceLabel}

        <p>Owner: {owner.toString()}</p>
        <Text as="p" style={{ fontWeight: "bolder" }}>
          {" "}
          {sellStatus}
        </Text>
        {priceInput}
        <Spinner size="5" loading={loader} />
        {button}
      </Card>
    </Box>
  );
}

export default Item;
