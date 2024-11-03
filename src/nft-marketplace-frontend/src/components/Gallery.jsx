import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Principal } from "@dfinity/principal";
import { Box, Grid, Heading } from "@radix-ui/themes";

function Gallery(props) {
  const [items, setItems] = useState();

  function fetchNFTS() {
    if (props.ids != undefined) {
      setItems(
        props.ids.map((NFTId) => (
          <Item id={NFTId} key={NFTId.toText()} role={props.role} />
        ))
      );
    } else {
      console.log("Byee....");
    }
  }

  useEffect(() => {
    fetchNFTS();
  }, []);
  return (
    <Box style={{ margin: "0 12%" }}>
      <Heading
        align={"center"}
        as="h1"
        size={"8"}
        style={{ fontFamily: "Roboto" }}
      >
        {props.title}
      </Heading>
      <hr style={{ width: "40%", margin: "40px auto" }} />
      <Grid columns="3" gap="5" width="auto">
        {items}
      </Grid>
    </Box>
  );
}

export default Gallery;
