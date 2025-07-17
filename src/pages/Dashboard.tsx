import { useEffect, useState } from "react";

import {
    Box,
    Flex,
    Image,
    Text,
    IconButton
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
export default function Dashboard() {
    type Profile = {
        name: string;
        email: string;
    }
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();
    const fetchprofile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/getmyprofile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data: {
                success: boolean;
                data: Profile;
                msg?: string;
            } = await response.json();

            if (data.success === true) {
                setProfile(data.data);
            } else {
                localStorage.removeItem("token");
                navigate("/");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchprofile();
    }, [])
    return (
        <>
            {!profile ? <></> : <Box h="100vh" display="flex" flexDirection="column">
                <Flex
                    as="header"
                    position="fixed"
                    top="0"
                    left="0"
                    right="0"
                    bg="white"
                    boxShadow={"md"}
                    px={1}
                    py={2}
                    alignItems="center"
                    justifyContent="space-between"
                    zIndex="1"
                >
                    <Image objectFit="contain" src="/assets/10050 svg.svg" alt="hospital" />
                    <Text
                        fontFamily={"Inter, sans-serif"}
                        fontSize={"lg"}
                        mx={"auto"}
                        display={["none", "none", "flex", "flex"]}
                        fontWeight={"medium"}
                    >
                        PPLDOC SUPERADMIN DASHBOARD
                    </Text>
                </Flex>
                <Flex flex="1" mt="55px">
                    <Box
                        position="fixed"
                        as="nav"
                        bg="white"
                        borderRight="1px solid gray.200"
                        display={["none", "none", "flex", "flex"]}
                        flexDirection={"column"}
                        minHeight={"100%"}
                        width={isSidebarOpen ? "250px" : "60px"}
                    >
                        <Box paddingLeft={2} display={"flex"} flexDir={"column"}>
                            <Box
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                paddingRight={2}
                                mt={4}
                                marginLeft={!isSidebarOpen ? 1 : 0}
                                // mb={!isSidebarOpen ? 1 : 0}
                            >
                                <IconButton
                                    aria-label="Toggle Sidebar"
                                    bgColor={"white"}
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    size="sm"
                                    // mt={!isSidebarOpen ? 4 : 0}
                                    color={'black'}
                                    _hover={{ bgColor: "white" }}
                                >
                                    <GiHamburgerMenu />
                                </IconButton>
                            </Box>
                        </Box>
                        {isSidebarOpen && <>
                            <Box display={"flex"} flexDirection={"column"} height={"85vh"}>
                                <Box
                                    display={"flex"}
                                    p={4}
                                    flexDirection={"column"}
                                    gap={4}
                                    flexGrow={1}
                                >
                                    <Box
                                        display={"flex"}
                                        alignItems={"center"}
                                        px={4}
                                        py={1}
                                        color={
                                            pathname === "/superadmin"
                                                ? "white"
                                                : "black"
                                        }
                                        borderRadius={"lg"}
                                        backgroundColor={
                                            pathname === "/superadmin" ? "#3B82F6"
                                                : ""
                                        }
                                        _hover={{ bg: "#d6e4fc", cursor: "pointer" }}
                                        // onClick={() => {
                                        //     navigate("/doctor");
                                        // }}
                                        width={"100%"}
                                    >
                                        <IconButton
                                            color={
                                                pathname === "/superadmin"

                                                    ? "white"
                                                    : "black"
                                            }
                                            bgColor={"transparent"}
                                            _hover={{ bg: "transparent" }}
                                            _focus={{ boxShadow: "none" }}
                                            _active={{ bg: "transparent" }}
                                        >
                                            <FaUser size="24px" />
                                        </IconButton>

                                        <Text
                                            fontSize={["lg", "lg", "lg", "lg", "lg"]}
                                            fontWeight={"medium"}
                                            fontFamily={"Inter, sans-serif"}
                                        >
                                            {" "}
                                            Hospitals
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </>}
                    </Box>
                    <Box
                        flex="1"
                        p={6}
                        bgColor={"#E7EAEE"}
                        overflowX={"scroll"}
                        padding="20px"
                        marginLeft={
                            isSidebarOpen ? [0, 0, "250px", "250px"] : [0, 0, "60px", "60px"]
                        }
                        // sx={
                        //     {
                        //         "::-webkit-scrollbar": {
                        //             display: "none",
                        //         },
                        //         msOverflowStyle: "none",
                        //         scrollbarWidth: "none",
                        //     }
                        // }
                    >
                        <Text>Hare Krishna Har Har Mahadev</Text>
                    </Box>
                </Flex>




            </Box>}

        </>
    )
}
