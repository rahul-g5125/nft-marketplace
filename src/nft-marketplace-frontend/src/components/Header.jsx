import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import logoLight from "/logo-light.png";
import logoDark from "/logo-dark.png";
import "./Header.css";
import { Half2Icon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

const Header = (props) => {
  function changeMode() {
    props.changeLDMode();
  }
  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">
        <NavigationMenu.Item className="logo-wrapper">
          <a href="/">
            {props.mode ? (
              <img className="logo" src={logoDark} alt="Logo"></img>
            ) : (
              <img className="logo" src={logoLight} alt="Logo"></img>
            )}
          </a>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <IconButton
            variant="solid"
            color="gray"
            style={{ padding: "2px", marginRight: "20px" }}
            highContrast
          >
            <Half2Icon
              height={"30px"}
              width={"auto"}
              style={{ cursor: "pointer" }}
              onClick={changeMode}
            />
          </IconButton>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/discover" className="NavigationMenuLink">
            Discover
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/minter" className="NavigationMenuLink">
            Minter
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            href="/collection"
            className="NavigationMenuLink"
          >
            My NFTs
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="ViewportPosition">
        <NavigationMenu.Viewport className="NavigationMenuViewport" />
      </div>
    </NavigationMenu.Root>
  );
};

const ListItem = React.forwardRef(
  ({ className, children, title, ...props }, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className={classNames("ListItemLink", className)}
          {...props}
          ref={forwardedRef}
        >
          <div className="ListItemHeading">{title}</div>
          <p className="ListItemText">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
);

export default Header;
