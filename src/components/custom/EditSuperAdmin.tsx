import { Field, Box, Input, Button, Spinner, CloseButton, Dialog, Portal, Center } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
import { useEffect, useState } from "react";
import type { superAdmin } from "./SuperAdminTable";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    id: string,
    setSuperAdmins: React.Dispatch<React.SetStateAction<superAdmin[]>>
}
type superadminedit = {
    name: string;
    phone: string;
    email: string;
}


export default function EditSuperAdmin(props: Proptype) {
    const [loading, setLoading] = useState(false)
    const [superAdmins, setSuperAdmins] = useState<superadminedit | null>(null)
    const navigate = useNavigate()



    const validate = (values: superadminedit) => {
        const errors: Partial<Record<keyof superadminedit, string>> = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
        const phoneRegex = /^[1-9]\d{9}$/;

        if (!values.name.trim()) {
            errors.name = 'Superadmin name is required';
        }
        if (values.email && !emailRegex.test(values.email)) {
            errors.email = 'Email should be valid';
        }

        if (!phoneRegex.test(values.phone)) {
            errors.phone = 'Phone number should be 10 digits';
        }
        return errors;
    }



    const onSubmit = async (values: superadminedit,
        actions: FormikHelpers<superadminedit>) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const request: superadminedit = {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.toString().trim()
            }
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/edithospitalsuperadmin/${props.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            actions.setSubmitting(false);
            const data: { success: boolean; msg?: string } = await response.json();
            if (data.success) {
                props.setSuperAdmins((prevData) =>
                    prevData.map((item) =>
                        item.userid === props.id ? { ...item, name: values.name, email: values.email, phone: values.phone } : item
                    ))
                actions.resetForm();
                toaster.create({
                    title: "Hospital Superadmin updated successfully.",
                    type: "success",
                    duration: 2500,
                });
                props.onClose()
            } else {
                if (data.msg === "Super Admin with this email and phone number already exists.") {
                    toaster.create({
                        title: "Hospital Super Admin with this email and phone number already exists.",
                        type: "error",
                        duration: 2500,
                    });
                } else if (data.msg === "Super Admin with this email already exists.") {
                    toaster.create({
                        title: "Hospital Super Admin with this email already exists.",
                        type: "error",
                        duration: 2500,
                    });
                }
                else if (data.msg === "Super Admin with this phone number already exists.") {
                    toaster.create({
                        title: "Hospital Super Admin with this phone number already exists.",
                        type: "error",
                        duration: 2500,
                    });
                } else {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            }
            actions.setSubmitting(false);
        } catch (error) {
            actions.setSubmitting(false);
            console.error("Error:", error);
        }
    }

    const fetchSuperAdminById = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/gethospitalsuperadminbyid/${props.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: superadminedit; msg?: string } = await response.json();
            if (data.success) {
                setSuperAdmins(data.data || null);
            } else {
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    }




    useEffect(() => {
        fetchSuperAdminById();
    }, [])



    return (
        <Dialog.Root open={props.isOpen}>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>

                    {loading ? (<Center>
                        <Spinner size="xl" />
                    </Center>) : <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Edit Hospital SuperAdmin</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    name: superAdmins?.name ?? "",
                                    email: superAdmins?.email ?? "",
                                    phone: superAdmins?.phone ?? ""
                                }}
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
                                                <Button
                                                    type="submit"
                                                    loading={isSubmitting}
                                                    colorPalette="blue"
                                                    width="full"
                                                >
                                                  Update Hospital SuperAdmin
                                                </Button>
                                            </Box>
                                        </Form>
                                }
                            </Formik>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => { props.onClose(); }} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>}
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}