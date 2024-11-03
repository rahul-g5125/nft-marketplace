import { Box } from "@radix-ui/themes";

export default function PriceLabel(props) {
  return (
    <>
      <Box>Price: {props.sellPrice} DRAG</Box>
    </>
  );
}
