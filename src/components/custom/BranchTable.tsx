import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu"
import { FaEye } from "react-icons/fa";
// import { FaEdit } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { CSVLink } from "react-csv";
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
    Tag,
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
import ViewBranch from "./ViewBranch";


type createdBy = {
    name: string;
    userid: string;
}
export type branch = {
    userid: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    createdAt: string;
    isActive: boolean;
    isdefault: boolean;
    createdBy?: createdBy;
}
const headers = [
    { label: "Hospital Branch Id", key: "userid" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "phone", key: "phone" },
    { label: "address", key: "address" },
    { label: "isActive", key: "isActive" },
    { label: "Creation Date", key: "createdAt" },
];
export default function BranchTable({ hospitalId }: { hospitalId: string }) {
    const navigate = useNavigate();
    const [branches, setBranches] = useState<branch[]>([]);
    const [searchInput, setSearchInput] = useState('')
    const [isViewOpen,setIsViewopen]=useState(false);
    const [viewDetails,setViewDeatils] = useState<branch | null>(null)


    const [loading, setLoading] = useState(true);
    const fetchBranch = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/getallbranchbyhospital/${hospitalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: branch[]; msg?: string } = await response.json();
            if (data.success) {
                setBranches(data.data || []);
            } else {
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


     
    const data = useMemo(() => branches, [branches]);
    const columns = useMemo<ColumnDef<branch>[]>(
        () => [
            { header: 'Branch Id', accessorKey: 'userid' },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: info => <Text title={info.getValue<string>()}>{info.getValue<string>().slice(0, 25)}{info.getValue<string>().length > 25 ? "..." : ''}</Text>,
            },
            {
                header: 'View',
                cell: ({row}) => {
                    return <IconButton
                        aria-label="Edit"
                        bgColor={"white"}
                        color={"#3B82F6"}
                        _hover={{
                            bgColor: "white",
                        }}
                    onClick={() => {
                        setIsViewopen(true)
                        setViewDeatils(row.original)
                    }}
                    >
                        <FaEye />
                    </IconButton>
                },
            },
            // {
            //     header: 'Edit',
            //     cell: () => {
            //         return <IconButton
            //             aria-label="Edit"
            //             bgColor={"white"}
            //             color={"#3B82F6"}
            //             _hover={{
            //                 bgColor: "white",
            //             }}
            //         // onClick={() => {
            //         //     setIsEditOpen(true)
            //         //     setEditsuperadminId(row.original.userid)
            //         // }}
            //         >
            //             <FaEdit />
            //         </IconButton>
            //     },
            // },
            {
                header: 'Status',
                cell: ({ row }) => {
                    return row.original.isActive ? <Tag.Root size="sm" colorPalette={'green'}>
                        <Tag.Label>Active</Tag.Label>
                    </Tag.Root> : <Tag.Root size="sm" colorPalette={'red'}>
                        <Tag.Label>InActive</Tag.Label>
                    </Tag.Root>
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

    useEffect(() => {
        fetchBranch()
    }, [])
    return (
        <>
            {loading ? (
                <Center>
                    <Spinner size="xl" />
                </Center>
            ) : <>
                <Box display="flex"
                    justifyContent="space-between"
                    mb={4}
                    flexDirection={["column", "row", "row", "row"]}
                    gap={5}>
                    <CSVLink data={branches} filename={`Branches of ${hospitalId}`} headers={headers}>
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
            </>}
            {isViewOpen?<ViewBranch isOpen={isViewOpen} onClose={() => { setIsViewopen(false) }} data={viewDetails}></ViewBranch>:''}
        </>
    )
}
