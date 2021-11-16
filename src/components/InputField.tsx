import React, { HTMLAttributes, InputHTMLAttributes } from "react";
import { Box } from "@chakra-ui/layout";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input, Textarea, TextareaProps } from "@chakra-ui/react";

type InputFieldProps = HTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textArea?: boolean;
  type?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  textArea,
  ...props
}) => {
  // let InputOrTextarea = Input;
  // // ComponentWithAs<"textarea", TextareaProps>
  // if (textarea) {
  //   InputOrTextarea = Textarea;
  // }
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {textArea == true ? (
        <Textarea {...field} {...(props as TextareaProps)} id={field.name} />
      ) : (
        <Input {...field} {...props} id={field.name} />
      )}

      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
