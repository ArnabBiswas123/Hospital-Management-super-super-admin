
import { Box, CloseButton, Center, Text, Dialog, Portal } from "@chakra-ui/react"
import type { branch } from "./BranchTable";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    data: branch | null
}

export default function ViewBranch(props: Proptype) {
    const userName = props.data?.createdBy?.name ?? "";
    const displayName =
        userName.length > 45
            ? `${userName.slice(0, 45)}…`
            : userName;

    return (
        <Dialog.Root size={'sm'}
            open={props.isOpen} >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Details of the Hospital Branch</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            {props.data ? (
                                <Box display={'flex'} flexDir={'column'} gap={2}>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch Id:</strong><Text title={props.data?.userid}>{props.data?.userid}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch Name:</strong><Text title={props.data?.name}>{props.data?.name.slice(0, 45)}{props.data?.name.length > 45 ? "..." : ''}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch Email:</strong> <Text title={props.data?.email}>{props.data?.email.slice(0, 45)}{props.data?.email.length > 45 ? "..." : ''}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch Phone:</strong> <Text title={props.data?.phone}>{props.data?.phone}</Text>
                                    </Box>
                                    {props.data?.isdefault ? <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch CreatedBy:</strong> <Text>Super Super Admin</Text>
                                    </Box> : <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch CreatedBy:</strong> <Text title={props.data?.createdBy?.name}>{`${displayName} , ${props.data?.createdBy?.userid}`}</Text>
                                    </Box>}

                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Branch Created At:</strong> <Text title={props.data?.createdAt}> {props.data?.createdAt && new Date(props.data.createdAt).toLocaleString('en-IN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}</Text>
                                    </Box>

                                </Box>
                            ) : (
                                <Box>No data selected</Box>
                            )}
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
