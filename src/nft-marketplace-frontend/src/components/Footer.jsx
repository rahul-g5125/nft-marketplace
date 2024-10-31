import React from "react";
import { Text, Box } from "@radix-ui/themes";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div id="footer">
      <footer>
        <Box style={{ width: "50%", margin: "auto" }}>
          <Box style={{ textAlign: "center" }}>
            <Text weight="medium">
              The Internet Computer's largest digital marketplace for crypto
              collectibles and non-fungible tokens (NFTs). <br />
              Buy, sell, and discover exclusive digital items.
            </Text>

            <br />
            <br />
            <Text>Copyright ⓒ {year}</Text>
          </Box>
        </Box>
      </footer>
    </div>
  );
}

export default Footer;
