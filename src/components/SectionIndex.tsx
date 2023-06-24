import { Card, CardBody, Text } from '@chakra-ui/react'

export interface SectionIndexProps {
    message: string
}

const SectionIndex = ({ message }: SectionIndexProps) => {
    return (
        <Card w="full">
            <CardBody>
                <Text fontSize='lg'>{message}</Text>
            </CardBody>
        </Card>
    )
}

export default SectionIndex