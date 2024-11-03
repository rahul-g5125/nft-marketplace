import { Box, Button } from "@radix-ui/themes";

export default function Sell(props) {
  return (
    <Box>
      <Button
        type="button"
        variant="classic"
        onClick={props.handleClick}
        className="form-Chip-label"
        loading={props.loader}
        style={{ cursor: "pointer", marginBottom: "10%" }}
      >
        {props.text}
      </Button>
    </Box>
  );
}
