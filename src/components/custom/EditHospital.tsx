import { Field, Box, Input, Button, Spinner, CloseButton, Dialog, Portal, Center } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { toaster } from "../ui/toaster";
import { useEffect, useState } from "react";
import type { Hospital } from "./HospitalTable";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    id: string,
    setHospitals: React.Dispatch<React.SetStateAction<Hospital[]>>
}
type hospitaltype = {
    email: string;
    name: string;
}


export default function EditHospital(props: Proptype) {
    const [loading, setLoading] = useState(false)
    const [hospital, setHospital] = useState<hospitaltype | null>(null)
    const navigate = useNavigate()

    const validate = (values: hospitaltype) => {
        const errors: Partial<Record<keyof hospitaltype, string>> = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;


        if (!values.name.trim()) {
            errors.name = 'Name is required';
        }
        if (values.email && !emailRegex.test(values.email)) {
            errors.email = 'Email should be valid';
        }
        return errors;
    }



    const onSubmit = async (values: hospitaltype,
        actions: FormikHelpers<hospitaltype>) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const request: hospitaltype = {
                name: values.name.trim(),
                email: values.email.trim(),
            }
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/edithospital/${props.id}`, {
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
                props.setHospitals((prevData) =>
                    prevData.map((item) =>
                        item.userid === props.id ? { ...item, name: values.name, email: values.email } : item
                    ))
                actions.resetForm();
                toaster.create({
                    title: "Hospital updated successfully.",
                    type: "success",
                    duration: 2500,
                });
                props.onClose()
            } else {
                if (data.msg === "Email is already in use by another hospital.") {
                    toaster.create({
                        title: "Hospital with this email already exists.",
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

    const fetchHospitalById = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/gethospitalbyid/${props.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: hospitaltype; msg?: string } = await response.json();
            if (data.success) {
                setHospital(data.data || null);
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
        fetchHospitalById();
    }, [])



    return (
        <Dialog.Root open={props.isOpen}>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>

                    {loading ? (<Center>
                        <Spinner size="xl" />
                    </Center>) :
                        <Dialog.Content>
                            <Center my={4}>
                                <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Edit Hospital</Dialog.Title>
                            </Center>
                            <Dialog.Body>
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        name: hospital?.name ?? "",
                                        email: hospital?.email ?? "",
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
                                                    <Field.Root required
                                                        invalid={!!(touched.email && errors.email)}
                                                    >
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
                                                    <Button
                                                        type="submit"
                                                        loading={isSubmitting}
                                                        colorPalette="blue"
                                                        width="full"
                                                    >
                                                        Register Hospital and Branch
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
                    }

                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

