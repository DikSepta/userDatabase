import UserActionTypes from "./user.action.types";
import { formatUserData } from "./user.utils";
import axios from "axios";

export const fetchUserStart = () => ({
	type: UserActionTypes.FETCH_USER_START,
});

export const fetchUserSuccess = (user) => ({
	type: UserActionTypes.FETCH_USER_SUCCESS,
	payload: user,
});

export const fetchUserFailure = (error) => ({
	type: UserActionTypes.FETCH_USER_FAILURE,
	payload: error,
});

export const fetchUser = () => {
	return (dispatch) => {
		dispatch(fetchUserStart());

		axios
			.get(`https://randomuser.me/api/?results=100`)
			.then((res) => {
				dispatch(fetchUserSuccess(formatUserData(res.data.results)));
			})
			.catch((err) => {
				dispatch(fetchUserFailure(err.message));
			});
	};
};

export const resetFilter = (isReset) => ({
	type: UserActionTypes.RESET_FILTER,
	payload: isReset,
});
