import { useEffect, useState } from "react";

import {
    Box,
    Flex,
    Image,
    Text,
    IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation } from "react-router-dom";
import { Tooltip } from "../components/ui/tooltip";
import { HiOutlineLogout } from "react-icons/hi";
import HospitalTable from "../components/custom/HospitalTable";
import { FaHospital } from "react-icons/fa";
import BranchTable from "../components/custom/BranchTable";
import AddHospital from "../components/custom/AddHospital";
import SuperAdminTable from "../components/custom/SuperAdminTable";
export default function Dashboard() {
    type Profile = {
        name: string;
        email: string;
    }
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { pathname } = location;
    const { hospitalid } = useParams();

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
                    <Tooltip content="Logout" showArrow>
                        <IconButton
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/");
                            }}

                            bgColor={"transparent"}
                            _hover={{ bg: "transparent" }}
                            _focus={{ boxShadow: "none" }}
                            _active={{ bg: "transparent" }}

                        >
                            <HiOutlineLogout color="red" />
                        </IconButton>
                    </Tooltip>
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
                            >
                                <IconButton
                                    aria-label="Toggle Sidebar"
                                    bgColor={"white"}
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    size="sm"
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
                                    px={4}
                                    py={4}
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
                                            pathname === "/superadmin" || (pathname.includes("/superadmin/hospitalbranch") && hospitalid) || pathname.includes("/superadmin/addhospitalbranch") || (pathname.includes("/superadmin/hospitalsuperadmins") && hospitalid)
                                                ? "white"
                                                : "black"
                                        }
                                        borderRadius={"lg"}
                                        backgroundColor={
                                            pathname === "/superadmin" || (pathname.includes("/superadmin/hospitalbranch") && hospitalid) || pathname.includes("/superadmin/addhospitalbranch") || (pathname.includes("/superadmin/hospitalsuperadmins") && hospitalid) ? "#3B82F6"
                                                : ""
                                        }
                                        _hover={{ bg: "#d6e4fc", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/superadmin");
                                        }}
                                        width={"100%"}
                                    >
                                        <IconButton
                                            color={
                                                pathname === "/superadmin" || (pathname.includes("/superadmin/hospitalsuperadmins") && hospitalid) || pathname.includes("/superadmin/addhospitalbranch") || (pathname.includes("/superadmin/hospitalbranch") && hospitalid)

                                                    ? "white"
                                                    : "black"
                                            }
                                            bgColor={"transparent"}
                                            _hover={{ bg: "transparent" }}
                                            _focus={{ boxShadow: "none" }}
                                            _active={{ bg: "transparent" }}
                                        >
                                            <FaHospital size="24px" />
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
                        {!isSidebarOpen && (
                            <>
                                <Box display={"flex"} flexDirection={"column"} height={"85vh"}>
                                    <Box
                                        display={"flex"}
                                        py={4}
                                        flexDirection={"column"}
                                        gap={4}
                                        flexGrow={1}
                                    >
                                        <Tooltip content="Hospitals" positioning={{ placement: "right-end" }} showArrow>
                                            <Box
                                                display={"flex"}
                                                alignItems={"center"}
                                                gap={4}
                                                px={2}
                                                py={1}
                                                width={"100%"}
                                                backgroundColor={
                                                    pathname === "/superadmin" || pathname.includes("/superadmin/addhospitalbranch") || (pathname.includes("/superadmin/hospitalsuperadmins") && hospitalid) || (pathname.includes("/superadmin/hospitalbranch") && hospitalid) ? "#3B82F6" : ""
                                                }
                                                _hover={{ bg: "#d6e4fc", cursor: "pointer" }}

                                                onClick={() => {
                                                    navigate("/superadmin");
                                                }}
                                            >
                                                <IconButton
                                                    color={
                                                        pathname === "/superadmin" || pathname.includes("/superadmin/addhospitalbranch") || (pathname.includes("/superadmin/hospitalbranch") && hospitalid) || (pathname.includes("/superadmin/hospitalsuperadmins") && hospitalid) ? "white" : "black"
                                                    }
                                                    bgColor={"transparent"}
                                                    _hover={{ bg: "transparent" }}
                                                    _focus={{ boxShadow: "none" }}
                                                    _active={{ bg: "transparent" }}
                                                >
                                                    <FaHospital size="24px" />
                                                </IconButton>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </>
                        )}
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
                    >
                        <Text
                            fontFamily={"Inter, sans-serif"}
                            fontSize={"lg"}
                            mx={"auto"}
                            marginBottom={2}
                            fontWeight={"bold"}
                            display={["flex", "flex", "none", "none"]}
                        >
                            PPLDOC SUPERADMIN DASHBOARD
                        </Text>

                        {pathname === "/superadmin" ? (
                            <HospitalTable></HospitalTable>
                        ) : (
                            ""
                        )}
                        {pathname.includes("/superadmin/hospitalbranch") && !!hospitalid ? (
                            <BranchTable hospitalId={hospitalid}></BranchTable>
                        ) : (
                            ""
                        )}
                        {pathname.includes("/superadmin/hospitalsuperadmins") && !!hospitalid ? (
                            <SuperAdminTable hospitalId={hospitalid}></SuperAdminTable>
                        ) : (
                            ""
                        )}
                        {pathname.includes("/superadmin/addhospitalbranch") ? (
                            <AddHospital></AddHospital>
                        ) : (
                            ""
                        )}
                    </Box>
                </Flex>
            </Box>}

        </>
    )
}
