import { createSelector } from "reselect";

export const selectUser = (state) => state.user;

export const selectUserList = createSelector(
	[selectUser],
	(user) => user.userList
);

export const selectIsLoading = createSelector(
	[selectUser],
	(user) => user.isLoading
);

export const selectResetFilter = createSelector(
	[selectUser],
	(user) => user.resetFilter
);
