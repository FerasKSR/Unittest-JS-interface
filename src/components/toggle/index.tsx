import { colors } from "lib/styles/colors";
import { darken, lighten } from "polished";
import { useState } from "react";
import styled, { keyframes } from "styled-components";

const Wrapper = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  align-items: center;
  background: ${({ isActive }) => (isActive ? colors.violet : "transparent")};
  border: ${({ isActive }) =>
    isActive ? "1px solid transparent" : `1px solid ${colors.greyDark}`};
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  outline: none;
  padding: 4px;
  width: fit-content;
`;

const turnOnToggle = keyframes`
  from {
    margin-left: 0em;
    margin-right: 2.2em;
  }
  to {
    margin-left: 2.2em;
    margin-right: 0em;
  }
`;

const turnOffToggle = keyframes`
  from {
    margin-left: 2.2em;
    margin-right: 0em;
  }
  to {
    margin-left: 0em;
    margin-right: 2.2em;
  }
`;

const ToggleElementHoverStyle = (hasBgColor: boolean, isActive?: boolean) =>
  hasBgColor
    ? {
        opacity: "0.8"
      }
    : {
        background: isActive
          ? lighten(0.15, colors.violet)
          : darken(0.05, colors.greyLight),
        color: isActive ? colors.white : colors.black
      };

const ToggleElement = styled.span<{
  isActive?: boolean;
  bgColor?: string;
  isInitialToggleLoad?: boolean;
}>`
  animation: 0.1s
    ${({ isActive, isInitialToggleLoad }) =>
      isInitialToggleLoad ? "none" : isActive ? turnOnToggle : turnOffToggle}
    ease-in;
  background: ${({ bgColor, isActive }) =>
    isActive
      ? bgColor ?? lighten(0.09, colors.violet)
      : bgColor
        ? colors.greyLight
        : colors.greyDark};
  border-radius: 50%;
  height: 24px;
  &:hover {
    ${({ bgColor, isActive }) => ToggleElementHoverStyle(!!bgColor, isActive)}
  }
  margin-left: ${({ isActive }) => isActive && "2.2em"};
  margin-right: ${({ isActive }) => !isActive && "2.2em"};
  width: 24px;
`;

interface ToggleProps {
  id?: string;
  bgColor?: string;
  isActive: boolean;
  toggle: () => void;
}

export default function Toggle({ id, bgColor, isActive, toggle }: ToggleProps) {
  const [isInitialToggleLoad, setIsInitialToggleLoad] = useState(true);

  const switchToggle = () => {
    toggle();
    if (isInitialToggleLoad) setIsInitialToggleLoad(false);
  };

  return (
    <Wrapper
      id={id}
      data-testid={id}
      role="option"
      aria-selected={isActive}
      isActive={isActive}
      onClick={switchToggle}
    >
      <ToggleElement
        isActive={isActive}
        bgColor={bgColor}
        isInitialToggleLoad={isInitialToggleLoad}
      />
    </Wrapper>
  );
}
