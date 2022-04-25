import React from "react";
import "./with-spinner.styles.scss";

const WithSpinner = (WrappedComponent) => {
	const Spinner = ({ isLoading, ...otherProps }) => {
		return isLoading ? (
			<div className="spinner__overlay">
				<div className="spinner__container"></div>
			</div>
		) : (
			<WrappedComponent {...otherProps}></WrappedComponent>
		);
	};

	return Spinner;
};

export default WithSpinner;
