import {
	Alert,
	AlertIcon,
	Button,
	ButtonGroup,
	Box,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/client";

const ManageTodo = ({ isOpen, onClose, initialRef, todo, setTodo }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isComplete, setIsComplete] = useState(false);
	const [isLoading, setIsLoading] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [selectedDateTime, setSelectedDateTime] = useState(new Date());
	const [startTime, setStartTime] = useState("");
	const [finishTime, setFinishTime] = useState("");

	useEffect(() => {
		if (todo) {
			setTitle(todo.title);
			setDescription(todo.description);
			setIsComplete(todo.isComplete);
			setSelectedDateTime(new Date(todo.dateTime));
			setStartTime(todo.startTime);
			setFinishTime(todo.finishTime);
		}
	}, [todo]);

	const submitHandler = async (event) => {
		//bevent.preventDefault();
		setErrorMessage("");
		setIsLoading(true);
		const user = supabaseClient.auth.user();
		let supabaseError;
		if (todo) {
			const { error } = await supabaseClient
				.from("todos")
				.update({
					title,
					description,
					isComplete,
					user_id: user.id,
					dateTime: selectedDateTime.toISOString(),
					startTime,
					finishTime,
				})
				.eq("id", todo.id);
			supabaseError = error;
		} else {
			const { error } = await supabaseClient.from("todos").insert([
				{
					title,
					description,
					isComplete,
					user_id: user.id,
					dateTime: selectedDateTime.toISOString(),
					startTime,
					finishTime,
				},
			]);
			supabaseError = error;
		}

		setIsLoading(false);
		if (supabaseError) {
			setErrorMessage(supabaseError.message);
		} else {
			closeHandler();
		}
	};

	const closeHandler = () => {
		setTitle("");
		setDescription("");
		setIsComplete(false);
		setSelectedDateTime(new Date());
		setStartTime("");
		setFinishTime("");
		setTodo(null);
		onClose();
	};
	useEffect(() => {
		if (todo && todo.finishTime) {
			const currentTime = new Date().toLocaleTimeString();
			if (currentTime > todo.finishTime) {
				setIsComplete(true);
			}
		}
	}, [todo]);

	useEffect(() => {
		if (isComplete) {
			// Aggiorna lo stato "isComplete" nel database
			const updateTodo = async () => {
				try {
					await supabaseClient.from("todos").update({ isComplete: true }).eq("id", todo.id);
				} catch (error) {
					console.error("Error updating todo:", error.message);
				}
			};

			updateTodo();
		}
	}, [isComplete, todo]);

	const handleFinishTimeChange = (event) => {
		setFinishTime(event.target.value);
		const currentTime = new Date().toLocaleTimeString();
		if (currentTime > event.target.value) {
			setIsComplete(true);
		} else {
			setIsComplete(false);
		}
	};

	return (
		<Box>
			<Modal isOpen={isOpen} onClose={onClose} isCentered initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent mx={2} my={0}>
					<form onSubmit={submitHandler}>
						<ModalHeader>{todo ? "Aggiorna Orari" : "Add Todo"}</ModalHeader>
						<ModalCloseButton onClick={closeHandler} />
						<ModalBody pb={0}>
							{errorMessage && (
								<Alert status="error" borderRadius="lg" mb="6">
									<AlertIcon />
									<Text textAlign="center">{errorMessage}</Text>
								</Alert>
							)}
							<FormControl isRequired={true}>
								<FormLabel>Titolo</FormLabel>
								<Input ref={initialRef} placeholder="Aggiungi Titolo" onChange={(event) => setTitle(event.target.value)} value={title} />
							</FormControl>

							<FormControl mt={4} isRequired={true}>
								<FormLabel>Date e Orario</FormLabel>
								<Input
									type="date"
									onChange={(event) => setSelectedDateTime(new Date(event.target.value))}
									value={selectedDateTime.toISOString().split("T")[0]}
								/>
							</FormControl>

							<FormControl mt={4} isRequired={true}>
								<FormLabel>Inizio Turno</FormLabel>
								<Input type="time" onChange={(event) => setStartTime(event.target.value)} value={startTime} />
							</FormControl>

							<FormControl mt={4} isRequired={true}>
								<FormLabel>Fine Turno</FormLabel>
								<Input type="time" onChange={(event) => setFinishTime(event.target.value)} value={finishTime} />
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Descrizione</FormLabel>
								<Textarea placeholder="Aggiungere descrizione" onChange={(event) => setDescription(event.target.value)} value={description} />
							</FormControl>

							<FormControl mt={4}>
								<FormLabel>Finito?</FormLabel>
								<Switch isChecked={isComplete} id="is-completed" onChange={(event) => setIsComplete(!isComplete)} />
							</FormControl>
						</ModalBody>

						<ModalFooter mt={-7}>
							<ButtonGroup spacing="3">
								<Button onClick={closeHandler} colorScheme="red" type="reset" isDisabled={isLoading}>
									Cancel
								</Button>
								<Button colorScheme="blue" type="submit" isLoading={isLoading}>
									{todo ? "Update" : "Save"}
								</Button>
							</ButtonGroup>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default ManageTodo;
