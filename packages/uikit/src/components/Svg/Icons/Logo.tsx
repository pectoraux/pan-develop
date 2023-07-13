import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";
import { Text } from "../../Text";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Text bold fontSize={20} color="primary">PAYSWAP</Text>
  );
};

export default Icon;
