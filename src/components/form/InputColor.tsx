import { useField } from "formik";
import { useRef } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { transition } from "../ui/styles";
import Error from "./Error";
import Input from "./Input";
import { InputColorProps } from "./types";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background: ${colors.greyLight};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;
  cursor: pointer;
  ${transition}
`;

const ColorPicker = styled(Input).attrs({
  type: "color"
})`
  appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  height: 2.5rem;
  width: 2.5rem;
  padding: 0;
`;

export default function InputColor({ name, ...props }: InputColorProps) {
  const [field, meta] = useField<string>(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  const colorRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Container
        onClick={() => {
          colorRef.current?.click();
        }}
      >
        <span style={{ color: colors.greyDark }}>
          {field.value?.toUpperCase() || props.placeholder}
        </span>
        <ColorPicker name={name} ref={colorRef} />
      </Container>
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
