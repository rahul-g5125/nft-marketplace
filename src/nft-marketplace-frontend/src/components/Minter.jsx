import { Box, Button, Heading, Spinner, TextField } from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { nft_marketplace_backend } from "../../../declarations/nft-marketplace-backend";
import Item from "./Item";
import * as Form from "@radix-ui/react-form";
import { FileIcon } from "@radix-ui/react-icons";

function Minter() {
  const { register, handleSubmit } = useForm();
  const [nftPrincipal, setNFTPrincipal] = useState("");
  const [spinner, setSpinner] = useState(false);
  const fileUpload = useRef();

  async function onSubmit(data) {
    setSpinner(true);
    const name = data.name;
    const image = data.image[0];

    const imageByteData = [...new Uint8Array(await image.arrayBuffer())];
    const principal = await nft_marketplace_backend.mint(imageByteData, name);
    setNFTPrincipal(principal);
    setButtonValue("Minted!");
  }

  const handleButtonClick = () => {
    fileUpload.current.click();
  };

  if (nftPrincipal == "") {
    return (
      <>
        <Spinner size={6} loading={spinner}></Spinner>
        <Box style={{ textAlign: "center" }}>
          <Heading
            align={"center"}
            as="h1"
            size={"8"}
            style={{ fontFamily: "Roboto", marginBottom: "2rem" }}
          >
            Create NFT
          </Heading>
          <Form.Root noValidate="" autoComplete="off">
            <Heading
              align={"center"}
              as="h2"
              size={"4"}
              style={{ fontFamily: "Roboto" }}
            >
              Upload Image
            </Heading>

            <Form.Field name="File Input">
              <Form.Control asChild>
                <div className="button-wrapper">
                  <Button
                    onClick={handleButtonClick}
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <FileIcon /> Upload File
                  </Button>
                  <input
                    {...register("image", { required: true })}
                    ref={fileUpload}
                    hidden={true}
                    type="file"
                    accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                  />
                </div>
              </Form.Control>
            </Form.Field>
            <Heading
              align={"center"}
              as="h2"
              size={"4"}
              style={{ fontFamily: "Roboto" }}
            >
              Collection Name
            </Heading>
            <Form.Field name="Collection Name">
              <Form.Control asChild>
                <div>
                  <TextField.Root
                    {...register("name", { required: true })}
                    placeholder="e.g. CryptoDunks"
                    style={{
                      maxWidth: "20%",
                      minWidth: "30%",
                      margin: "1% auto",
                      height: "40px",
                      padding: "10px",
                    }}
                    radius="full"
                    type="text"
                  ></TextField.Root>
                </div>
              </Form.Control>
            </Form.Field>
            <div>
              <Button
                loading={spinner}
                type="button"
                radius="full"
                color="gray"
                highContrast
                style={{ cursor: "pointer" }}
                onClick={handleSubmit(onSubmit)}
              >
                Mint NFT
              </Button>
            </div>
          </Form.Root>
        </Box>
      </>
    );
  } else {
    return (
      <div>
        <h3>Minted!</h3>
        <div>
          <Item id={nftPrincipal.toString()} />
        </div>
      </div>
    );
  }
}

export default Minter;
