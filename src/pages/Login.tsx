import { useState } from "react"
import {
    Center,
    VStack,
    Text,
    Image,
    Input,
    Field,
    Box,
    Button,

} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
type Error = {
    email?: string;
    password?: string;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Error>({});

    const handleSubmit = async () => {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|in|io|co|me|info|biz|xyz)$/;
            const newErrors: Record<string, string> = {};
            const trimmedPassword = password.trim();

            if (email.trim() === "") {
                newErrors.email = "Email is required";
            } else if (!emailRegex.test(email)) {
                newErrors.email = "Email should be valid";
            }

            if (trimmedPassword === "") {
                newErrors.password = "Password is required";
            } else if (trimmedPassword.length < 5) {
                newErrors.password = "Password must be at least 5 characters";
            }

            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                setIsLoading(true);
                const response: Response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            password: trimmedPassword,
                        }),
                    }
                );
                const data: {
                    success: boolean;
                    token?: string;
                    msg?: string;
                } = await response.json();
                setIsLoading(false)
                if (data.success === true) {
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    navigate("/superadmin");
                } else {
                    toaster.create({
                        title: data.msg,
                        type: "error",
                        duration: 2500,
                    })
                }
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        handleSubmit();
    };


    return (
        <Center w={"100vw"} h={"100vh"} bgColor={"#F3F4F6"}>
            <Center
                w={["100%", "70%", "60%", "40%", "30%"]}
                borderRadius={"2%"}
                display={"flex"}
                flexDirection={"row"}
                bgColor={"white"}
                gap={"20%"}
                boxShadow="dark-lg"
                paddingBottom={10}
            >
                <VStack w={"100%"} >
                    <Image
                        objectFit="contain"
                        src="/assets/10050 svg.svg"
                        width={"50%"}
                        alt="Purchase"
                        mt={8}
                    />
                    <Text
                        fontSize={["lg", "xl", "2xl", "2xl", "2xl"]}
                        as={"b"}
                        fontFamily={"Inter, sans-serif"}
                        color={"black"}
                    >
                        {" "}
                        Hospital Management System
                    </Text>
                    <Text
                        fontSize={["md", "lg", "xl", "xl", "xl"]}
                        mb={4}
                        fontFamily={"Inter, sans-serif"}
                        color={"black"}
                    >
                        {" "}
                        Sign in to your account
                    </Text>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{ width: "100%" }}>
                        <Box
                            width={"100%"}
                            display={"flex"}
                            flexDir={"column"}
                            gap={4}
                            paddingX={8}
                        >
                            {" "}
                            <Field.Root invalid={!!errors.email}>
                                <Field.Label fontWeight={"bold"} fontFamily="Georgia, serif">
                                    Email
                                </Field.Label>
                                <Input
                                    placeholder="Enter your email"
                                    fontFamily="Georgia, serif"
                                    type="text"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({ ...errors, email: "" });
                                    }}
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
                            <Field.Root
                                invalid={!!errors.password}
                            >
                                <Field.Label fontWeight={"bold"} fontFamily="Georgia, serif">
                                    Password
                                </Field.Label>
                                <Input
                                    placeholder="Enter your password"
                                    fontFamily="Georgia, serif"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors({ ...errors, password: "" });
                                    }}
                                />
                                {errors.password ? (
                                    <Field.ErrorText
                                        fontSize={["xs", "sm", "sm", "sm", "sm"]}
                                        fontFamily="Georgia, serif"
                                    >
                                        {errors.password}
                                    </Field.ErrorText>
                                ) : (
                                    ""
                                )}
                            </Field.Root>
                        </Box>
                        <Box width={"100%"} paddingX={8} marginTop={6}>
                            <Button
                                width={"100%"}
                                fontFamily="Georgia, serif"
                                colorPalette="blue"
                                type="submit"
                                loading={isLoading}
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                </VStack>
            </Center>
        </Center>
    )
}
