import { Box, Divider, Heading, Tag, Text, Button, Center } from "@chakra-ui/react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const SingleTodo = ({ todo, openHandler, deleteHandler, isDeleteLoading }) => {
	const getDateInMonthDayYear = (date) => {
		const formattedDate = format(new Date(date), "d MMMM yyyy H:mm:ss", { locale: it });
		return formattedDate;
	};

	return (
		<Box
			color='black'
			position="relative"
			// maxW="md"
			width="300px"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			p="4"
			onClick={() => openHandler(todo)}
			cursor="pointer"
			transition="background-color 0.2s ease"
			_hover={{ backgroundColor: "#252525", color: "white" }}
		>
			<Heading size="xs" mt="3">
				{todo.title}
			</Heading>
			<Divider my="4" />
			<Heading size="xs" mt="3">
				Giorno
			</Heading>
			<Heading size="md">{format(new Date(todo.dateTime), "d MMMM yyyy", { locale: it })}</Heading>
			<Divider my="4" />
			<Heading size="xs" mt="3">
				Inizi alle:
			</Heading>
			<Heading as="h5" size="md">
				{format(new Date(`1970-01-01T${todo.startTime}`), "HH:mm")}
			</Heading>
			<Heading size="xs" mt="3">
				Finisci alle:
			</Heading>
			<Heading as="h5" size="md">
				{format(new Date(`1970-01-01T${todo.finishTime}`), "HH:mm")}
			</Heading>
			<Divider my="4" />
			<Tag position="absolute" top="3" right="2" bg={todo.isComplete ? "green.500" : "yellow.400"} borderRadius="3xl" size="sm" />
			<Text color="gray.400" mt="1" fontSize="sm">
				{getDateInMonthDayYear(todo.insertedat)}
			</Text>
			<Divider my="4" />
			<Text noOfLines={[1, 2, 3]} color="gray.800">
				{todo.description}
			</Text>
			<Center>
				<Button
					mt="4"
					size="sm"
					colorScheme="red"
					onClick={(event) => {
						event.stopPropagation();
						deleteHandler(todo.id);
					}}
					isLoading={isDeleteLoading}
					loadingText="Deleting"
					isDisabled={isDeleteLoading}
				>
					Elimina
				</Button>
			</Center>
		</Box>
	);
};

export default SingleTodo;
