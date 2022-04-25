import React from "react";
import { fetchUser } from "./redux/user/user.action";
import { selectIsLoading } from "./redux/user/user.selector";
import { useEffect } from "react";
import { connect } from "react-redux";
import Header from "./component/header/header.component";
import Table from "./component/table/table.component";
import WithSpinner from "./component/with-spinner/with-spinner.component";
import "./App.scss";

const TableWithSpinner = WithSpinner(Table);

const App = ({ isLoading, fetchUser }) => {
	// render only once when component did mount
	useEffect(() => {
		fetchUser();
	}, []);

	// const data = React.useMemo(() => userList, []);

	return (
		<div className="app__container">
			<Header />
			<TableWithSpinner isLoading={isLoading} />
		</div>
	);
};

const mapStateToProps = (state) => ({
	isLoading: selectIsLoading(state),
});

const mapDispatchToProps = (dispatch) => {
	return {
		fetchUser: () => {
			dispatch(fetchUser());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
