import { Box, Button, ButtonGroup, Center, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabaseClient } from "../lib/client";
import { Image } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { FiPlusSquare } from "react-icons/fi";

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
			
			<Box
				as="header"
				height="auto"
				width={{base: "90%",md: "80%", lg: "60%"}}
				py="8"
				px="9"
				bg="#252525"
				color="white"
				position="fixed"
				bottom={{ base: 0 }}
				zIndex={100}
				m={{base: "12px",md: "15px", lg: "30px"}}
				borderRadius={{ base: "40px" }}
			>
				{/* <Box maxW="6xl" mx="auto"> */}
					{/* <Center> */}
					{/* <Flex as="nav" aria-label="Site navigation" align="center" justify="space-between" wrap="wrap" direction={{ base: "column", md: "row" }}> */}
					{/* <NavLink href="/">
								<Heading mr="4" as="button" >
									<Image src="/horaeLogo.png" w="100px" h="100px" />
								</Heading>
							</NavLink> */}
					<Center>
						<SimpleGrid gap={{base: "10px",lg: "50px"}} columns={{ base: 3, sm: 3, md: 3, lg: 3 }}>
							<Button color="#ffffff" variant="outline" _hover={{ bg: "#ffffff", color: "#252525" }} leftIcon={<FiUser />} fontSize={{base: "12px", md: "15px", lg: "18px"}}>
								<NavLink href="/profile">Profilo</NavLink>
							</Button>
							{router.pathname === "/" && (
								<Button bg="#ffffff" color="#252525" onClick={onOpen} leftIcon={<FiPlusSquare />} fontSize={{base: "12px", md: "15px", lg: "18px"}}>
									Aggiungi
								</Button>
							)}
							<Button colorScheme="red" onClick={logoutHandler} isLoading={isLogoutLoading} fontSize={{base: "12px", md: "15px", lg: "18px"}}>
								Logout
							</Button>
						</SimpleGrid>
					</Center>
					{/* </Flex> */}
					{/* </Center> */}
				{/* </Box> */}
			</Box>
		</Center>
	);
};

export default Navbar;
