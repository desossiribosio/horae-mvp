import { useDisclosure } from "@chakra-ui/hooks";
import { Box, HStack, SimpleGrid, Tag, Flex } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";
import { supabaseClient } from "../lib/client";

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
				<title>Horae</title>
				<meta name="description" content="Project research | Mohole" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Box bg="white" minHeight="100vh">
					<Box pb={"200px"}>
						<Navbar onOpen={onOpen} />
						<ManageTodo isOpen={isOpen} onClose={onClose} initialRef={initialRef} todo={todo} setTodo={setTodo} />
						<HStack p="10" spacing="4" justify="center">
							<Box>
								<Tag bg="green.500" borderRadius="3xl" size="sm" mt="1" /> Complete
							</Box>
							<Box>
								<Tag bg="yellow.400" borderRadius="3xl" size="sm" mt="1" /> Incomplete
							</Box>
						</HStack>
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: "2", md: "4", lg: "6" }} m="10">
							{todos.map((todo, index) => (
								<SingleTodo todo={todo} key={index} openHandler={openHandler} deleteHandler={deleteHandler} isDeleteLoading={isDeleteLoading} />
							))}
						</SimpleGrid>
					</Box>
				</Box>
			</main>
		</div>
	);
};

export default Home;
