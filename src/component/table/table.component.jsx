import React from "react";
import { connect } from "react-redux";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useAsyncDebounce,
} from "react-table";

import "./table.style.scss";
import {
	selectResetFilter,
	selectUserList,
} from "../../redux/user/user.selector";
import {
	usePagination,
	useSortBy,
} from "react-table/dist/react-table.development";
import { resetFilter } from "../../redux/user/user.action";
// Define a default UI for filtering
const GlobalFilter = ({
	isResetFilter,
	resetFilter,
	globalFilter,
	setGlobalFilter,
}) => {
	const [value, setValue] = React.useState(globalFilter);

	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value || undefined);
	}, 200);
	console.log("im rendered", value);
	return (
		<div className="form__input">
			<label className="form__label" htmlFor="searchKeyword">
				Search
			</label>
			<input
				className="form__text-input"
				name="searchKeyword"
				value={globalFilter ? value : ""}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder={`Search records...`}
			/>
		</div>
	);
};

// This is a custom filter UI for selecting
// a unique option from a list
const SelectColumnFilter = ({
	isResetFilter,
	resetFilter,
	column: { filterValue, setFilter, preFilteredRows, id },
}) => {
	// Calculate the options for filtering
	// using the preFilteredRows
	const options = React.useMemo(() => {
		const options = new Set();
		preFilteredRows.forEach((row) => {
			options.add(row.values[id]);
		});
		return [...options.values()];
	}, [id, preFilteredRows]);
	console.log(filterValue);
	// Render a multi-select box
	return (
		<div className="form__input">
			<label className="form__label" htmlFor="selectGender">
				Gender
			</label>
			<select
				name="selectGender"
				className="form__selector"
				value={filterValue ? filterValue : ""}
				onChange={(e) => {
					setFilter(e.target.value || undefined);
				}}>
				<option value="">All</option>
				{options.map((option, i) => (
					<option key={i} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

const mapStateToPropsFilter = (state) => ({
	isResetFilter: selectResetFilter(state),
});

const mapDispatchToPropsFilter = (dispatch) => {
	return {
		resetFilter: (isReset) => {
			dispatch(resetFilter(isReset));
		},
	};
};

const Pagination = ({
	gotoPage,
	previousPage,
	pageIndex,
	pageCount,
	canNextPage,
	canPreviousPage,
	pageSize,
	setPageSize,
	nextPage,
}) => {
	let page = [];

	page.push(
		pageIndex == 0
			? pageIndex + 1
			: pageIndex == pageCount - 1
			? pageIndex - 1
			: pageIndex
	);

	if (pageCount > 1) {
		page.push(
			pageIndex == 0
				? pageIndex + 2
				: pageIndex == pageCount - 1
				? pageIndex
				: pageIndex + 1
		);
	}

	if (pageCount > 2) {
		page.push(
			pageIndex == 0
				? pageIndex + 3
				: pageIndex == pageCount - 1
				? pageIndex + 1
				: pageIndex + 2
		);
	}

	return (
		<div className="pagination">
			<button
				className="pagination__btn"
				onClick={() => gotoPage(0)}
				disabled={!canPreviousPage}>
				{"First"}
			</button>
			<button
				className="pagination__btn"
				onClick={() => previousPage()}
				disabled={!canPreviousPage}>
				{"Prev"}
			</button>
			{page.map((page, idx) => (
				<button
					key={idx}
					className={`pagination__btn pagination__btn-num ${
						page == pageIndex + 1 ? "pagination__btn-active" : ""
					}`}
					onClick={() => gotoPage(page - 1)}>
					{page}
				</button>
			))}
			<button
				className="pagination__btn"
				onClick={() => nextPage()}
				disabled={!canNextPage}>
				{"Next"}
			</button>
			<button
				className="pagination__btn"
				onClick={() => gotoPage(pageCount - 1)}
				disabled={!canNextPage}>
				{"Last"}
			</button>
			<select
				className="form__selector"
				value={pageSize}
				onChange={(e) => {
					setPageSize(Number(e.target.value));
				}}>
				{[10, 20, 30, 40, 50].map((pageSize) => (
					<option key={pageSize} value={pageSize}>
						Show {pageSize}
					</option>
				))}
			</select>
		</div>
	);
};

// Our table component
const Table = (userList, resetFilter) => {
	const filterTypes = React.useMemo(
		() => ({
			//override the default text filter to use
			// "startWith"
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue)
								.toLowerCase()
								.includes(String(filterValue).toLowerCase())
						: true;
				});
			},
		}),
		[]
	);

	const columns = React.useMemo(
		() => [
			{
				Header: "Username",
				accessor: "username",
				disableSortBy: true,
			},
			{
				Header: "Name",
				accessor: "name",
			},
			{
				Header: "Email",
				accessor: "email",
			},
			{
				Header: "Gender",
				accessor: "gender",
				Filter: SelectColumnFilter,
				filter: "exact",
			},
			{
				Header: "Registered Date",
				accessor: "registeredDate",
			},
		],
		[]
	);
	const data = React.useMemo(() => userList.userList, []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		state,
		setFilter,
		preGlobalFilteredRows,
		setGlobalFilter,
		page, // Instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
			filterTypes,
		},
		useFilters, // useFilters!
		useGlobalFilter, // useGlobalFilter!
		useSortBy,
		usePagination
	);

	// We don't want to render all of the rows for this example, so cap
	// it for this use case
	// const firstPageRows = rows.slice(0, 10);
	console.log(state.globalFilter);
	return (
		<>
			<div className="form__group">
				<GlobalFilter
					isResetFilter={state.globalFilter ? false : true}
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={state.globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				{headerGroups[0].headers[3].render("Filter")}
				<button
					className="form__button"
					onClick={() => {
						setFilter("gender", undefined);
						setGlobalFilter("");
						//resetFilter(true);
					}}>
					Reset Filter
				</button>
			</div>
			<table className="table__container" {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								// Add the sorting props to control sorting. For this example
								// we can add them into the header props
								<th {...column.getHeaderProps(column.getSortByToggleProps())}>
									<span>{column.render("Header")}</span>
									{/* Add a sort direction indicator */}
									{column.canSort ? (
										column.isSorted ? (
											column.isSortedDesc ? (
												<div className="sort__container">
													<div className="sort__icon">&#x25B2;</div>
													<div className="sort__icon sort__icon-active">
														&#x25BC;
													</div>
												</div>
											) : (
												<div className="sort__container">
													<div className="sort__icon sort__icon-active">
														&#x25B2;
													</div>
													<div className="sort__icon">&#x25BC;</div>
												</div>
											)
										) : (
											<div className="sort__container">
												<div className="sort__icon">&#x25B2;</div>
												<div className="sort__icon">&#x25BC;</div>
											</div>
										)
									) : null}
								</th>
							))}
						</tr>
					))}
				</thead>
				{page.length ? (
					<tbody {...getTableBodyProps()}>
						{page.map((row, i) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell) => {
										return (
											<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				) : (
					<div className="table__nodata">No record found</div>
				)}
			</table>
			<Pagination
				canPreviousPage={canPreviousPage}
				canNextPage={canNextPage}
				pageOptions={pageOptions}
				pageCount={pageCount}
				gotoPage={gotoPage}
				nextPage={nextPage}
				previousPage={previousPage}
				setPageSize={setPageSize}
				pageIndex={state.pageIndex}
				pageSize={state.pageSize}
			/>
			<br />
		</>
	);
};

const mapStateToProps = (state) => ({
	userList: selectUserList(state),
});

export default connect(mapStateToProps, mapDispatchToPropsFilter)(Table);
