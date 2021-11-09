import React, { InputHTMLAttributes } from "react";
import { Box } from "@chakra-ui/layout";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
