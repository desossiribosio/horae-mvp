import { Box, Button, ButtonGroup, Center, Flex, Heading } from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabaseClient } from "../lib/client";
import { Image } from "@chakra-ui/react";


const Navbar = ({ onOpen }) => {
	const router = useRouter();
	const [isLogoutLoading, setIsLogoutLoading] = useState(false);

	const logoutHandler = async () => {
		try {
			setIsLogoutLoading(true);
			await supabaseClient.auth.signOut();
			router.push("/signin");
		} catch (error) {
			router.push("/signin");
		} finally {
			setIsLogoutLoading(false);
		}
	};

	return (
		<Center>
			<Box as="header" height="auto" width="auto" p="4" pl="9" pr="9" bg="#252525" color="white"  position={"fixed"} bottom={0} zIndex={100} m='10' borderRadius='100px'>
				<Box maxW="6xl" mx="auto">
					<Flex as="nav" aria-label="Site navigation" align="center" justify="space-between" wrap="wrap">
						<NavLink href="/">
							<Heading mr="4" as="button">
								<Image src="/horaeLogo.png" w="100px" h="100px" />
							</Heading>
						</NavLink>
						<Box>
							<NavLink href="/profile">Profilo</NavLink>
							<ButtonGroup spacing="4" ml="6">
								{router.pathname === "/" && (
									<Button bg="#ffffff" color="#252525" onClick={onOpen}>
										Aggiungi Orario
									</Button>
								)}
								<Button colorScheme="red" onClick={logoutHandler} isLoading={isLogoutLoading}>
									Logout
								</Button>
							</ButtonGroup>
						</Box>
					</Flex>
				</Box>
			</Box>
		</Center>
	);
};

export default Navbar;
