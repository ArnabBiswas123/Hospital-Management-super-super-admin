
import {
  Field,
  Box,
  Input,
  Button,
  Center

} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";

type hospitalvalue = {
  name: string;
  email: string;
  branchName: string;
  branchEmail: string;
  branchPhone: string;
  branchAddress: string;
}

export default function AddHospital() {

  const initialValues: hospitalvalue = {
    name: '',
    email: '',
    branchName: '',
    branchEmail: '',
    branchPhone: '',
    branchAddress: ''
  };

  const navigate = useNavigate();
  const validate = (values: hospitalvalue) => {
    const errors: Partial<Record<keyof hospitalvalue, string>> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
    const phoneRegex = /^[1-9]\d{9}$/;

    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }

    if (values.email && !emailRegex.test(values.email)) {
      errors.email = 'Email should be valid';
    }
    if (!values.branchName.trim()) {
      errors.branchName = 'Branch name is required';
    }
    if (!phoneRegex.test(values.branchPhone)) {
      errors.branchPhone = 'Branch phone number should be 10 digits';
    }
    if (values.branchEmail && !emailRegex.test(values.branchEmail)) {
      errors.branchEmail = 'Branch email should be valid';
    }
    if (!values.branchAddress.trim()) {
      errors.branchAddress = 'Branch address is required';
    }


    return errors;
  }
  const onSubmit = async (values: hospitalvalue,
    actions: FormikHelpers<hospitalvalue>) => {
    console.log("Form submitted!");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      const request: hospitalvalue = {
        name: values.name.trim(),
        email: values.email.trim(),
        branchEmail: values.branchEmail.trim(),
        branchName: values.branchName.trim(),
        branchPhone: values.branchPhone.toString().trim(),
        branchAddress: values.branchAddress.trim()
      }
      const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/addhospitalbranch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });
      actions.setSubmitting(false);
      const data: { success: boolean; msg?: string } = await response.json();
      if (data.success) {
        actions.resetForm();
        navigate('/superadmin');
      } else {
        if (data.msg === "Hospital with this email already exists.") {
          toaster.create({
            title: "Hospital with this email already exists.",
            type: "error",
            duration: 2500,
          });
        }
        else if (data.msg === "Hospital branch with this email already exists.") {
          toaster.create({
            title: "Branch with this email already exists.",
            type: "error",
            duration: 2500,
          });
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
      actions.setSubmitting(false);


    } catch (error) {
      actions.setSubmitting(false);
      console.error("Error:", error);
    }
  }

  return (
    <Box bgColor={"white"} boxShadow={"lg"} padding={8} borderRadius={"lg"}>
      <Box
        fontWeight={"bold"}
        fontFamily="Inter, sans-serif"
        fontSize={"xl"}
        marginBottom={4}
      >
        Register Hospital and Branch
      </Box>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {
          ({ handleSubmit, values, errors, touched, handleChange, handleBlur, isSubmitting }) =>
            <Form onSubmit={handleSubmit}>
              <Box
                display={"flex"}
                gap={8}
                flexDir={["column", "column", "column", "row"]}
                mb={4}
              >
                <Field.Root required invalid={!!(touched.name && errors.name)}>
                  <Field.Label fontWeight={"bold"}>
                    Name of the hospital
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter name of the hospital"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={50}
                  />
                  {errors.name ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.name}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
                <Field.Root required invalid={!!(touched.email && errors.email)}>
                  <Field.Label fontWeight={"bold"}>
                    Email of the hospital
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter email of the hospital"
                    name="email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.email}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
              </Box>
              <Box
                display={"flex"}
                gap={8}
                flexDir={["column", "column", "column", "row"]}
                mb={4}
              >
                <Field.Root invalid={!!(touched.branchName && errors.branchName)} required>
                  <Field.Label fontWeight={"bold"}>
                    Name of the branch
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter name of the branch"
                    name="branchName"
                    type="text"
                    value={values.branchName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.branchName ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.branchName}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
                <Field.Root invalid={!!(touched.branchEmail && errors.branchEmail)} required>
                  <Field.Label fontWeight={"bold"}>
                    Email of the branch
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name="branchEmail"
                    placeholder="Enter email of the branch"
                    type="text"
                    value={values.branchEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.branchEmail ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.branchEmail}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
              </Box>
              <Box
                display={"flex"}
                gap={8}
                flexDir={["column", "column", "column", "row"]}
                mb={4}
              >
                <Field.Root invalid={!!(touched.branchPhone && errors.branchPhone)} required>
                  <Field.Label fontWeight={"bold"}>
                    Phone of the branch
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter phone number of the branch"
                    name="branchPhone"
                    type="number"
                    css={{
                      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                      /* For Firefox */
                      "&[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                    onChange={e => {
                      if (e.target.value.length <= 10) {
                        handleChange(e);
                      }
                    }}
                    value={values.branchPhone}
                    // onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.branchPhone ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.branchPhone}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
                <Field.Root invalid={!!(touched.branchAddress && errors.branchAddress)} required>
                  <Field.Label fontWeight={"bold"}>
                    Address of the branch
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="Enter address of the branch"
                    name="branchAddress"
                    type="text"
                    value={values.branchAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.branchAddress ? (
                    <Field.ErrorText
                      fontFamily="Georgia, serif"
                      fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    >
                      {errors.branchAddress}
                    </Field.ErrorText>
                  ) : (
                    ""
                  )}
                </Field.Root>
              </Box>
              <Center mt={4}>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  colorPalette="blue"
                  width="full"
                >
                  Register Hospital and Branch
                </Button>
              </Center>
            </Form>
        }
      </Formik>
    </Box>
  )
}
