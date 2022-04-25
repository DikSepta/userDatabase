export const formatUserData = (rawUserData) => {
	const formattedUserData = [];

	rawUserData.map((user) => {
		let date = user.registered.date.slice(0, -1);
		let dateComponent = date.split("T");
		let timeComponent = dateComponent[1].split(":");

		formattedUserData.push({
			username: user.login.username,
			name: user.name.first + " " + user.name.last,
			email: user.email,
			gender: user.gender,
			registeredDate:
				dateComponent[0] + " " + timeComponent[0] + ":" + timeComponent[1],
		});
	});
	return formattedUserData;
};
