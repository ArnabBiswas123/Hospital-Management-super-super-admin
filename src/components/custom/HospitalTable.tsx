import { useEffect, useState, useMemo } from "react"
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
    Table
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu"
import { FaEdit } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { CSVLink } from "react-csv";

type Hospital = {
    userid: string;
    name: string;
    email: string;
    createdAt: string;
}
const headers = [
    { label: "HospitalId", key: "userid" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Creation Date", key: "createdAt" },
];

export default function HospitalTable() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    const fetchHospitals = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            setLoading(true);
            const response: Response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/v1/superadmin/getallhospitals`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLoading(false);
            const data: { success: boolean; data?: Hospital[]; msg?: string } = await response.json();
            if (data.success) {
                setHospitals(data.data || []);
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
        fetchHospitals()
    }, [])
    const handleBranchClick = (hospital: Hospital) => {
        navigate(`/superadmin/hospitalbranch/${hospital.userid}`);
    }

    const data = useMemo(() => hospitals, [hospitals]);
    const columns = useMemo<ColumnDef<Hospital>[]>(
        () => [
            { header: 'Hospital Id', accessorKey: 'userid' },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: info => <Text title={info.getValue<string>()}>{info.getValue<string>().slice(0, 15)}{info.getValue<string>().length > 20 ? "..." : ''}</Text>,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: info => <Text title={info.getValue<string>()}>{info.getValue<string>().slice(0, 15)}{info.getValue<string>().length > 20 ? "..." : ''}</Text>,
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: info => new Date(info.getValue<string>()).toLocaleString(),
            },
            {
                header: 'Branches',
                cell: ({ row }) => {
                    return <IconButton
                        aria-label="Edit"
                        bgColor={"white"}
                        color={"#3B82F6"}
                        _hover={{
                            bgColor: "white",
                        }}
                        onClick={() => handleBranchClick(row.original)}
                    >
                        <FaExternalLinkAlt />
                    </IconButton>
                },
            },

            {
                header: 'Edit',
                cell: () => {
                    return <IconButton
                        aria-label="Edit"
                        bgColor={"white"}
                        color={"#3B82F6"}
                        _hover={{
                            bgColor: "white",
                        }}
                    // onClick={() => handleEditClick(row.original)}
                    >
                        <FaEdit />
                    </IconButton>
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
        initialState: { sorting: [{ id: 'createdAt', desc: true }] },
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
                    <CSVLink data={hospitals} filename="Hospitals.csv" headers={headers}>
                        <Button
                            fontFamily="Inter, sans-serif"
                            backgroundColor={"white"}
                            boxShadow={"md"}
                            color={'black'}
                        >
                            <FiDownload/>
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
                        navigate('/superadmin/addhospitalbranch')
                      }}
                    >
                        Add Hospital
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
                                                {/* {{ asc: <TriangleUpIcon ml={2} />, desc: <TriangleDownIcon ml={2} /> }[header.column.getIsSorted() as string] ?? null} */}
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
        </>
    )
}
