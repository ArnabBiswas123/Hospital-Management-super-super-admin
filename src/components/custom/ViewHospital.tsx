
import { Box, CloseButton, Center, Text, Dialog, Portal } from "@chakra-ui/react"
import type { Hospital } from "./HospitalTable";
type Proptype = {
    isOpen: boolean,
    onClose: () => void,
    data: Hospital | null
}

export default function ViewHospital(props: Proptype) {
    return (
        <Dialog.Root size={'sm'}
            open={props.isOpen} >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Center my={4}>
                            <Dialog.Title fontSize={'lg'} fontWeight={"bold"}>Details of the Hospital</Dialog.Title>
                        </Center>
                        <Dialog.Body>
                            {props.data ? (
                                <Box display={'flex'} flexDir={'column'} gap={2}>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Hospital Id:</strong><Text title={props.data?.userid}>{props.data?.userid}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Hospital Name:</strong><Text title={props.data?.name}>{props.data?.name.slice(0, 45)}{props.data?.name.length > 45 ? "..." : ''}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Hospital Email:</strong> <Text title={props.data?.email}>{props.data?.email.slice(0, 45)}{props.data?.email.length > 45 ? "..." : ''}</Text>
                                    </Box>
                                    <Box fontFamily="Inter, sans-serif" display={'flex'} gap={2}>
                                        <strong>Hospital Created At:</strong> <Text title={props.data?.createdAt}> {props.data?.createdAt && new Date(props.data.createdAt).toLocaleString('en-IN', {
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
