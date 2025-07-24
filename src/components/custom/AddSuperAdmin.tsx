import { Field, Box, Input, Button, CloseButton, Dialog, Portal, Center } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    id: string,
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}

type hospitalsuperadminvalue = {
    name: string; 
    email: string;
    phone: string;
    password: string;
    confirmPassword: string
}


export default function AddSuperAdmin(props: Proptype) {
    const navigate = useNavigate()
    const initialValues: hospitalsuperadminvalue = {
        name: '',
        email: '',
        phone: '',
        confirmPassword: '',
        password: ''
    };


    const onSubmit = async (values: hospitalsuperadminvalue,
        actions: FormikHelpers<hospitalsuperadminvalue>) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const request = {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.toString().trim(),
                password: values.password.trim(),
                confirmpassword: values.confirmPassword.trim(),
                associatedHospital:props.id
            }
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/addhospitalsuperadmin`, {
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
                toaster.create({
                    title: "Hospital super admin created successfully.",
                    type: "success",
                    duration: 2500,
                });
                props.setFetchAgain((prev) => !prev)
                props.onClose()
            } else {
                if (data.msg === "Super Admin with this email and phone number already exists.") {
                    toaster.create({
                        title: "Super Admin with this email and phone number already exists.",
                        type: "error",
                        duration: 2500,
                    });
                }
                else if (data.msg === "Super Admin with this email already exists.") {
                    toaster.create({
                        title: "Super Admin with this email already exists.",
                        type: "error",
                        duration: 2500,
                    })
                }
                else if (data.msg === "Super Admin with this phone already exists.") {
                    toaster.create({
                        title: "Super Admin with this phone number already exists.",
                        type: "error",
                        duration: 2500,
                    });
                }
                else {
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
    const validate = (values: hospitalsuperadminvalue) => {
        const errors: Partial<Record<keyof hospitalsuperadminvalue, string>> = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
        const phoneRegex = /^[1-9]\d{9}$/;
        const trimmedPassword = values.password.trim();
        const confirmpassword = values.confirmPassword.trim();
        if (!values.name.trim()) {
            errors.name = 'Superadmin name is required';
        }
        if (trimmedPassword === "") {
            errors.password = "Password is required";
        } else {
            if (trimmedPassword.length < 5) {
                errors.password = "Password must be atleast 5 characters";
            }
        }
        if (confirmpassword === "") {
            errors.confirmPassword = "Confirm password is required";
        } else {
            if (confirmpassword !== trimmedPassword) {
                errors.confirmPassword =
                    "Confirm password should match with password";
            }
        }

        if (values.email && !emailRegex.test(values.email)) {
            errors.email = 'Email should be valid';
        }

        if (!phoneRegex.test(values.phone)) {
            errors.phone = 'Phone number should be 10 digits';
        }
        return errors;
    }

    return (
        <Dialog.Root open={props.isOpen}>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>


                    <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Add Hospital SuperAdmin</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            <Formik
                                enableReinitialize
                                initialValues={initialValues}
                                validate={validate}
                                onSubmit={onSubmit}
                            >
                                {
                                    ({ handleSubmit, values, errors, touched, handleChange, handleBlur, isSubmitting }) =>
                                        <Form onSubmit={handleSubmit}>
                                            <Box display={"flex"} flexDirection={"column"} gap={4}>
                                                <Field.Root required
                                                    invalid={!!(touched.name && errors.name)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Name
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter name of the superadmin"
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
                                                <Field.Root required
                                                    invalid={!!(touched.email && errors.email)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Email
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter email of the superadmin"
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
                                                <Field.Root required
                                                    invalid={!!(touched.phone && errors.phone)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Phone Number
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter phone number of the superadmin"
                                                        name="phone"
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
                                                        value={values.phone}
                                                        onChange={e => {
                                                            if (e.target.value.length <= 10) {
                                                                handleChange(e);
                                                            }
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.phone ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.phone}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Field.Root required
                                                    invalid={!!(touched.password && errors.password)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Password
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Enter password of the superadmin"
                                                        name="password"
                                                        type="text"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.password ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.password}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Field.Root required
                                                    invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                                                >
                                                    <Field.Label fontWeight={"bold"}>
                                                        Confirm Password
                                                        <Field.RequiredIndicator />
                                                    </Field.Label>
                                                    <Input
                                                        placeholder="Confirm Password"
                                                        name="confirmPassword"
                                                        type="password"
                                                        value={values.confirmPassword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.confirmPassword ? (
                                                        <Field.ErrorText
                                                            fontFamily="Georgia, serif"
                                                            fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                                        >
                                                            {errors.confirmPassword}
                                                        </Field.ErrorText>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Field.Root>
                                                <Button
                                                    type="submit"
                                                    loading={isSubmitting}
                                                    colorPalette="blue"
                                                    width="full"
                                                >
                                                    Register Hospital SuperAdmin
                                                </Button>
                                            </Box>
                                        </Form>
                                }
                            </Formik>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => { props.onClose(); }} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>

                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
