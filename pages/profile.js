import { Avatar, Box, Button, Flex, FormControl, FormLabel, Input, Stack, Textarea, Heading, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { supabaseClient } from "../lib/client";

const Profile = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [website, setWebsite] = useState("");
	const [bio, setBio] = useState("");
	const [avatarurl, setAvatarurl] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);

	const user = supabaseClient.auth.user();

	useEffect(() => {
		if (user) {
			setEmail(user.email);
			supabaseClient
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.then(({ data, error }) => {
					if (!error && data.length > 0) {
						const profile = data[0];
						setUsername(profile.username || "");
						setWebsite(profile.website || "");
						setBio(profile.bio || "");
						setAvatarurl(profile.avatarurl || "");
					}
				})
				.catch((error) => {
					console.log("Error fetching profile:", error);
				});
		}
	}, [user]);

	const updateHandler = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		const body = { username, website, bio };
		const userId = user.id;
		try {
			const { error } = await supabaseClient.from("profiles").update(body).eq("id", userId);
			if (!error) {
				setUsername(body.username);
				setWebsite(body.website);
				setBio(body.bio);
			}
		} catch (error) {
			console.log("Error updating profile:", error);
		}
		setIsLoading(false);
	};

	function makeid(length) {
		let result = "";
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	const uploadHandler = async (event) => {
		setIsImageUploadLoading(true);
		const avatarFile = event.target.files[0];
		const fileName = makeid(10);

		try {
			const { error } = await supabaseClient.storage.from("avatars").upload(fileName, avatarFile, {
				cacheControl: "3600",
				upsert: false,
			});
			if (error) {
				console.log("Error uploading avatar:", error);
				return;
			}
			const { publicURL, error: publicURLError } = await supabaseClient.storage.from("avatars").getPublicUrl(fileName);
			if (publicURLError) {
				console.log("Error getting public URL for avatar:", publicURLError);
				return;
			}
			const userId = user.id;
			await supabaseClient
				.from("profiles")
				.update({
					avatarurl: publicURL,
				})
				.eq("id", userId);
			setAvatarurl(publicURL);
		} catch (error) {
			console.log("Error updating avatar URL:", error);
		}
		setIsImageUploadLoading(false);
	};

	return (
		<Box>
			<Head>
				<title>Profilo | Horae</title>
			</Head>
			<Navbar />
			<Center>
				<Box
					pt="10"
					width={{ base: "90vw", sm: "90vw", md: "40vw", lg: "500px" }}
					pb={{ base: "10", lg: "0" }}
					h={{ base: "74vh", lg: "80vh" }}
					overflow="auto"
				>
					<Flex align="center" justify="center" direction="column">
						<Avatar size="2xl" src={avatarurl || ""} />
						<FormLabel htmlFor="file-input" my="5" borderRadius="2xl" borderWidth="1px" textAlign="center" p="2" bg="#252525" color="white">
							{isImageUploadLoading ? "Uploading..." : "Upload Profile Picture"}
						</FormLabel>
						<Input type="file" hidden id="file-input" onChange={uploadHandler} multiple={false} disabled={isImageUploadLoading} />
					</Flex>
					<Stack borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} mt="-2" spacing="4" as="form" onSubmit={updateHandler}>
						<FormControl id="email" isRequired>
							<FormLabel>Email</FormLabel>
							<Input type="email" isDisabled={true} value={email} />
						</FormControl>
						<FormControl id="username">
							<FormLabel>Username</FormLabel>
							<Input placeholder="Add your username here" type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
						</FormControl>
						<FormControl id="website">
							<FormLabel>Website URL</FormLabel>
							<Input placeholder="Add your website here" type="url" value={website} onChange={(event) => setWebsite(event.target.value)} />
						</FormControl>
						<FormControl id="bio">
							<FormLabel>Bio</FormLabel>
							<Textarea placeholder="Add your bio here" value={bio} onChange={(event) => setBio(event.target.value)} />
						</FormControl>
						<Button bg="#252525" color="white" type="submit" isLoading={isLoading}>
							Update
						</Button>
					</Stack>
				</Box>
			</Center>
		</Box>
	);
};

export default Profile;
