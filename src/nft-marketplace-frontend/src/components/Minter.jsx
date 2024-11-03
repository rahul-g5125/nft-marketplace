import { Box, Button, Heading, Spinner, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { nft_marketplace_backend } from "../../../declarations/nft-marketplace-backend";
import Item from "./Item";
import * as Form from "@radix-ui/react-form";
import { FileIcon } from "@radix-ui/react-icons";

function Minter() {
  const { register, handleSubmit } = useForm();
  const [nftPrincipal, setNFTPrincipal] = useState("");
  const [spinner, setSpinner] = useState(false);

  const onInvalid = (errors) => console.error(errors);

  async function onSubmit(data) {
    console.log(data);

    setSpinner(true);
    const name = data.name;
    const image = data.image[0];

    const imageByteData = [...new Uint8Array(await image.arrayBuffer())];
    const principal = await nft_marketplace_backend.mint(imageByteData, name);
    setNFTPrincipal(principal);
  }

  const handleButtonClick = () => {
    console.log(document.getElementById("fileUploadInput").click());
  };

  if (nftPrincipal == "") {
    return (
      <>
        <Box
          style={{
            textAlign: "center",
          }}
        >
          <Heading
            align={"center"}
            as="h1"
            size={"8"}
            style={{ fontFamily: "Roboto", marginBottom: "2rem" }}
          >
            Create NFT
          </Heading>
          <Spinner size={6} loading={spinner}></Spinner>
          <Box
            style={{
              width: "50%",
              borderRadius: "8px",
              margin: "auto",
              padding: "2% 12%",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            }}
          >
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
                <Button
                  type="button"
                  onClick={handleButtonClick}
                  style={{
                    cursor: "pointer",
                    marginBottom: "8%",
                    marginTop: "2%",
                  }}
                >
                  {" "}
                  <FileIcon /> Upload File
                </Button>
                <Form.Control asChild>
                  <input
                    {...register("image", { required: true })}
                    hidden={true}
                    id="fileUploadInput"
                    type="file"
                    accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                  />
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
                  <TextField.Root
                    {...register("name", { required: true })}
                    placeholder="e.g. CryptoDunks"
                    style={{
                      margin: "1% auto",
                      height: "40px",
                      padding: "10px",
                      marginBottom: "8%",
                      marginTop: "2%",
                    }}
                    radius="full"
                    type="text"
                  ></TextField.Root>
                </Form.Control>
              </Form.Field>
              <Button
                onClick={handleSubmit(onSubmit, onInvalid)}
                loading={spinner}
                radius="full"
                color="gray"
                highContrast
                style={{ cursor: "pointer" }}
              >
                Mint NFT
              </Button>
            </Form.Root>
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <Box style={{ width: "50%", margin: "auto", textAlign: "center" }}>
        <Heading>Minted!</Heading>
        <Box style={{ width: "30%", margin: "5% auto" }}>
          <Item id={nftPrincipal.toString()} />
        </Box>
      </Box>
    );
  }
}

export default Minter;
