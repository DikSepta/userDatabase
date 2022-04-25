import UserActionTypes from "./user.action.types";

const INITIAL_STATE = {
	userList: [],
	isLoading: true,
	error: null,
	resetFilter: false,
};

const UserReducer = (prevState = INITIAL_STATE, action) => {
	switch (action.type) {
		case UserActionTypes.FETCH_USER_START:
			return {
				...prevState,
				isLoading: true,
			};
		case UserActionTypes.FETCH_USER_FAILURE:
			return {
				...prevState,
				isLoading: false,
				error: action.payload,
			};
		case UserActionTypes.FETCH_USER_SUCCESS:
			return {
				...prevState,
				isLoading: false,
				userList: action.payload,
			};
		case UserActionTypes.RESET_FILTER:
			return {
				...prevState,
				resetFilter: action.payload,
			};
		default:
			return prevState;
	}
};

export default UserReducer;
