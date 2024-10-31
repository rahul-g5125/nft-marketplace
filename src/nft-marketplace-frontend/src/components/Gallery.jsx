import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Principal } from "@dfinity/principal";
import { Heading } from "@radix-ui/themes";

function Gallery(props) {
  const [items, setItems] = useState();

  function fetchNFTS() {
    if (props.ids != undefined) {
      setItems(
        props.ids.map((NFTId) => <Item id={NFTId} key={NFTId.toText()} />)
      );
    } else {
      console.log("Byee....");
    }
  }

  useEffect(() => {
    fetchNFTS();
  }, []);
  return (
    <div>
      <Heading
        align={"center"}
        as="h1"
        size={"8"}
        style={{ fontFamily: "Roboto" }}
      >
        {props.title}
      </Heading>
      <div>{items}</div>
    </div>
  );
}

export default Gallery;
