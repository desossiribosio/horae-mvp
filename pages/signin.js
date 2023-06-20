import { Alert, AlertIcon, Box, Button, chakra, FormControl, FormLabel, Heading, Input, Stack, Text, Image, Center, Divider, AbsoluteCenter } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { supabaseClient } from "../lib/client";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState(null);

	const submitHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);
		try {
			const { error } = await supabaseClient.auth.signIn({
				email,
			});
			if (error) {
				setError(error.message);
			} else {
				setIsSubmitted(true);
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const changeHandler = (event) => {
		setEmail(event.target.value);
	};

	return (
		<Box minH="100vh" py="12" px={{ base: "4", lg: "8" }} bg="#252525" display={"flex"} alignItems={{base: "end", sm: "end", md: "start", lg: "start"}}>
			<Box maxW="md" mx="auto">
				<Center>
					<Image src="/horaeLogo.png" w={{base: "200px", sm: "150px", md: "250px", lg: "300px"}} h="auto" />
				</Center>
				<Heading textAlign="center" m="6" color={"white"}>
					Benvenuto ad Horae
				</Heading>
				{error && (
					<Alert status="error" mb="6">
						<AlertIcon />
						<Text textAlign="center">{error}</Text>
					</Alert>
				)}
				<Box py="8" px={{ base: "6", md: "10" }} shadow="base" rounded='xl' bg="white">
					{isSubmitted ? (
						<Heading size="md" textAlign="center" color="gray.600">
							Please check {email} for login link
						</Heading>
					) : (
						<chakra.form onSubmit={submitHandler}>
							<Stack spacing="6">
								<Button
									leftIcon={<FaGithub />}
									colorScheme="gray"
									variant="outline"
									size="lg"
									fontSize="md"
									onClick={() => {
										// Funzione di gestione per il login con GitHub
										supabaseClient.auth.signIn({ provider: "github" });
									}}
									isLoading={isLoading}
									disabled={isLoading}
									width="100%"
								>
									Accedi con GitHub
								</Button>

								<Box position="relative">
									<Divider />
									<AbsoluteCenter bg="white" px="4">
										oppure
									</AbsoluteCenter>
								</Box>

								<FormControl id="email">
									<FormLabel>Inserisci Email</FormLabel>
									<Input name="email" type="email" autoComplete="email" required value={email} onChange={changeHandler} />
								</FormControl>
								<Button color={"white"} type="submit" bg="#ff0000" size="lg" fontSize="md" isLoading={isLoading}>
									Sign in
								</Button>
							</Stack>
						</chakra.form>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default SignIn;
