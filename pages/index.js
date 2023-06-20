import { useDisclosure } from "@chakra-ui/hooks";
import { Box, HStack, SimpleGrid, Tag, Flex, Center, Spacer, AbsoluteCenter, Heading, Image, Divider, Icon } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";
import { supabaseClient } from "../lib/client";
import { FiChevronDown } from "react-icons/fi";

const Home = () => {
	const initialRef = useRef();
	const [todos, setTodos] = useState([]);
	const [todo, setTodo] = useState(null);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const user = supabaseClient.auth.user();

	useEffect(() => {
		if (!user) {
			router.push("/signin");
		}
	}, [user, router]);

	useEffect(() => {
		if (user) {
			supabaseClient
				.from("todos")
				.select("*")
				.eq("user_id", user?.id)
				.order("id", { ascending: false })
				.then(({ data, error }) => {
					if (!error) {
						setTodos(data);
					}
				});
		}
	}, [user]);

	useEffect(() => {
		const todoListener = supabaseClient
			.from("todos")
			.on("*", (payload) => {
				if (payload.eventType !== "DELETE") {
					const newTodo = payload.new;
					setTodos((oldTodos) => {
						const exists = oldTodos.find((todo) => todo.id === newTodo.id);
						let newTodos;
						if (exists) {
							const oldTodoIndex = oldTodos.findIndex((obj) => obj.id === newTodo.id);
							oldTodos[oldTodoIndex] = newTodo;
							newTodos = oldTodos;
						} else {
							newTodos = [...oldTodos, newTodo];
						}
						newTodos.sort((a, b) => b.id - a.id);
						return newTodos;
					});
				}
			})
			.subscribe();

		return () => {
			todoListener.unsubscribe();
		};
	}, []);

	const openHandler = (clickedTodo) => {
		setTodo(clickedTodo);
		onOpen();
	};

	const deleteHandler = async (todoId) => {
		setIsDeleteLoading(true);
		const { error } = await supabaseClient.from("todos").delete().eq("id", todoId);
		if (!error) {
			setTodos(todos.filter((todo) => todo.id !== todoId));
		}
		setIsDeleteLoading(false);
	};

	return (
		<div>
			<Head>
				<title>Home | Horae</title>
			</Head>
			<main>
				<Box position="absolute" top="0" left="0">
					<Heading mr="4" as="button">
						<Image src="/horaeLogo.png" w="100px" h="100px" />
					</Heading>
				</Box>
				<HStack p="10" spacing="4" position={"absolute"} top={"0"} right={"0"}>
					<Box fontSize={"10px"} display={"flex"} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>
						<Tag bg="green.500" borderRadius="3xl" size="sm" mr="1" /> Fatto
					</Box>
					<Box fontSize={"10px"} display={"flex"} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>
						<Tag bg="yellow.400" borderRadius="3xl" size="sm" mr="1" /> Lavora
					</Box>
				</HStack>
				{/* <Center> */}
				<Box bg="white" minHeight="100vh">
					<Box>
						<Navbar onOpen={onOpen} />
						<ManageTodo isOpen={isOpen} onClose={onClose} initialRef={initialRef} todo={todo} setTodo={setTodo} />

						<Center>
							{todos.length ? (
								<SimpleGrid
									columns={{ base: 1, md: 2, lg: 4 }}
									gap={{ base: "2", md: "4", lg: "6" }}
									pb={{ base: "10", lg: "0" }}
									mt="100px"
									h={{ base: "75vh", lg: "80vh" }}
									overflow={"auto"}
								>
									{todos.map((todo, index) => (
										<Center key={index}>
											<SingleTodo todo={todo} key={index} openHandler={openHandler} deleteHandler={deleteHandler} isDeleteLoading={isDeleteLoading} />
										</Center>
									))}
								</SimpleGrid>
							) : (
								<Center h="100vh">
									<Box>
										<Heading as="h1" size="xl">
											Evvai! Non hai lavoro
										</Heading>
										<Box position="relative" mt={5}>
											<Divider />
											<Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" bg="white" px="4">
												oppure
											</Box>
										</Box>
										<Heading as="h3" size="md" mt={5} textAlign="center">
											Aggiungi un turno
										</Heading>
										<Box textAlign="center" mt={2}>
											<Icon as={FiChevronDown} boxSize={6} />
										</Box>
									</Box>
								</Center>
							)}
						</Center>
					</Box>
				</Box>
				{/* </Center> */}
			</main>
		</div>
	);
};

export default Home;
