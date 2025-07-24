
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Box,
    Spinner,
    InputGroup,
    Center,
    Input,
    Button,
    IconButton,
    Text,
    Table,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu"
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { CSVLink } from "react-csv";
import ViewSuperAdmin from "./ViewSuperAdmin";
import AddSuperAdmin from "./AddSuperAdmin";
import EditSuperAdmin from "./EditSuperAdmin";
import ResetPassword from "./ResetPassword";
export type superAdmin = {
    userid: string;
    name: string;
    email: string;
    phone: string,
    createdAt: string;
    isActive: boolean
}
const headers = [
    { label: "Hospital Superadmin Id", key: "userid" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "phone", key: "phone" },
    { label: "isActive", key: "isActive" },
    { label: "Creation Date", key: "createdAt" },
];
export default function SuperAdminTable({ hospitalId }: { hospitalId: string }) {
    const navigate = useNavigate();
    const [superadmins, setSuperadmins] = useState<superAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('')
    const [viewDetails, setViewDeatils] = useState<superAdmin | null>(null)
    const [isviewOpen, setIsviewOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [fetchAgain, setFetchAgain] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editsuperAdminId, setEditsuperadminId] = useState('')
    const [ispasswordOpen,setIsPassswordOpen]=useState(false)
    const [passwordid,setPasswordId]=useState('')
    const fetchSuperAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/getallsuperadminbyhospital/${hospitalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: superAdmin[]; msg?: string } = await response.json();
            if (data.success) {
                setSuperadmins(data.data || []);
            } else {
                localStorage.removeItem("token");
                navigate("/")
            }
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    }


    useEffect(() => {
        fetchSuperAdmins();
    }, [fetchAgain])
    const data = useMemo(() => superadmins, [superadmins]);
    const columns = useMemo<ColumnDef<superAdmin>[]>(
        () => [
            { header: 'Superadmin Id', accessorKey: 'userid' },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: info => <Text title={info.getValue<string>()}>{info.getValue<string>().slice(0, 25)}{info.getValue<string>().length > 25 ? "..." : ''}</Text>,
            },
            {
                header: 'View',
                cell: ({ row }) => {
                    return <IconButton
                        aria-label="Edit"
                        bgColor={"white"}
                        color={"#3B82F6"}
                        _hover={{
                            bgColor: "white",
                        }}
                        onClick={() => {
                            setIsviewOpen(true)
                            setViewDeatils(row.original)
                        }}
                    >
                        <FaEye />
                    </IconButton>
                },
            },
            {
                header: 'Reset Password',
                cell: ({row}) => {
                    return <IconButton
                        aria-label="Edit"
                        bgColor={"white"}
                        color={"#3B82F6"}
                        _hover={{
                            bgColor: "white",
                        }}
                    onClick={() => {
                            setIsPassswordOpen(true)
                            setPasswordId(row.original.userid)
                        }}
                    >
                        <FaEdit />
                    </IconButton>
                },
            },
            {
                header: 'Edit',
                cell: ({ row }) => {
                    return <IconButton
                        aria-label="Edit"
                        bgColor={"white"}
                        color={"#3B82F6"}
                        _hover={{
                            bgColor: "white",
                        }}
                        onClick={() => {
                            setIsEditOpen(true)
                            setEditsuperadminId(row.original.userid)
                        }}
                    >
                        <FaEdit />
                    </IconButton>
                },
            },
            {
                header: "Action",
                cell: ({ row }) => {
                    return row.original.isActive ?
                        <Button
                            colorPalette="red"
                            size="xs"
                        // onClick={() => handleDisable(row.original.userid)}
                        >
                            Disable
                        </Button> :
                        <Button
                            colorPalette="green"
                            size="xs"
                        // onClick={() => handleEnable(row.original.userid)}
                        >
                            Enable
                        </Button>
                },
            },
        ], []);

    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, pagination },
        onGlobalFilterChange: setGlobalFilter,
        // onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // initialState: { sorting: [{ id: 'createdAt', desc: true }] },
    });
    return (
        <>
            {loading ? (<Center>
                <Spinner size="xl" />
            </Center>) : (<>
                <Box display="flex"
                    justifyContent="space-between"
                    mb={4}
                    flexDirection={["column", "row", "row", "row"]}
                    gap={5}>
                    <CSVLink data={superadmins} filename={`Superadmins of ${hospitalId}`} headers={headers}>
                        <Button
                            fontFamily="Inter, sans-serif"
                            backgroundColor={"white"}
                            boxShadow={"md"}
                            color={'black'}
                        >
                            <FiDownload />
                            <Text ml={2} fontSize={["sm", "md", "md", "md"]}>
                                {" "}
                                Download CSV
                            </Text>
                        </Button>
                    </CSVLink>
                    <Button
                        colorPalette="green"
                        fontFamily="Inter, sans-serif"
                        onClick={() => {
                            setAddOpen(true)
                        }}
                    >
                        Add Superadmin
                    </Button>
                </Box>
                <Box display={"flex"} flexDirection={"row-reverse"}>
                    <InputGroup width={["100%", "80%", "50%", "30%"]} mb={1} startElement={<LuSearch />}>
                        <Input
                            placeholder="Search hospitals..."
                            value={searchInput}
                            backgroundColor={'white'}
                            onChange={e => { setSearchInput(e.target.value); setGlobalFilter(e.target.value); }}
                        />
                    </InputGroup>
                </Box>
                <Box
                    bgColor={"white"}
                    boxShadow={"lg"}
                    padding={8}
                    borderRadius={"lg"}
                >
                    <Table.ScrollArea maxW="100%">
                        <Table.Root>
                            <Table.Header>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <Table.Row key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <Table.ColumnHeader
                                                key={header.id}
                                                textAlign="center"
                                                {...(header.column.getToggleSortingHandler
                                                    ? {
                                                        onClick: header.column.getToggleSortingHandler(),
                                                        cursor: 'pointer'
                                                    }
                                                    : {})}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </Table.ColumnHeader>
                                        ))}
                                    </Table.Row>
                                ))}
                            </Table.Header>
                            <Table.Body>
                                {table.getRowModel().rows.map(row => (
                                    <Table.Row key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <Table.Cell m={1} p={0} key={cell.id} textAlign="center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Box>
            </>)}
            {isviewOpen ? <ViewSuperAdmin isOpen={isviewOpen} onClose={() => { setIsviewOpen(false) }} data={viewDetails}></ViewSuperAdmin> : ''}
            {addOpen ? <AddSuperAdmin isOpen={addOpen} onClose={() => { setAddOpen(false) }} id={hospitalId} setFetchAgain={setFetchAgain} ></AddSuperAdmin> : ''}
            {isEditOpen ? <EditSuperAdmin isOpen={isEditOpen} setSuperAdmins={setSuperadmins} onClose={() => { setIsEditOpen(false) }} id={editsuperAdminId}></EditSuperAdmin> : ''}
            {ispasswordOpen?<ResetPassword id={passwordid} onClose={() => { setIsPassswordOpen(false) }} isOpen={ispasswordOpen}></ResetPassword>:''}
        </>
    )
}
