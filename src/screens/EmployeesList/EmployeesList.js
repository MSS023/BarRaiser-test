import {
  CheckBox,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage,
} from "@mui/icons-material";
import {
  IconButton,
  Paper,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  ToggleButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getEmployeesList } from "../../utilities/Utilities";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "first_name+last_name", headerName: "Full Name" },
  { field: "date_of_birth", headerName: "DOB" },
  { field: "address", headerName: "Address" },
  { field: "date_of_joining", headerName: "Date of Joining" },
  { field: "salary", headerName: "Salary" },
  { field: "designation", headerName: "Designation" },
  { field: "manager_id", headerName: "Manager ID" },
];

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 1 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "black",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#d3d3d3",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function EmployeesList(props) {
  const { setActive } = props;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [fetchedList, setFetchedList] = useLocalStorage("list", []);
  const [loading, setLoading] = useState(true);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  useEffect(() => {
    setActive("employeesList");
    async function populate() {
      let res = await getEmployeesList();
      res.forEach((emp, ind) => {
        emp["selected"] = false;
      });
      setData([...res]);
      setFetchedList([...res]);
      setLoading(false);
    }
    populate();
  }, [setFetchedList, setActive]);

  function handleChangePage(event, newPage) {
    setPage(newPage);
    setSelectAll(false);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function handleSelectAll() {
    for (let i = 0; i < rowsPerPage; i++) {
      data[rowsPerPage * page + i].selected = !selectAll;
    }
    setData([...data]);
    setSelectAll(!selectAll);
  }

  function handleSelectRow(index) {
    data[index].selected = !data[index].selected;
    setData([...data]);
    if (selectAll) {
      setSelectAll(false);
    }
  }

  function handleSearch() {
    const reg = (new RegExp(searchText,"i"));
    let newArr = fetchedList.filter((obj) => {
      const values = Object.values(obj);
      for (let i = 0; i < values.length; i++) {
        const val = values[i];
        if (typeof val !== "string") {
          continue;
        }
        if (val.match(reg)) {
          return true;
        }
      }
      return false;
    });
    setData([...newArr]);
  }

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="employees-list h-100 d-flex flex-column align-items-center px-3">
      <div className="search-container d-flex flex-column flex-grow-1 w-100 justify-content-center">
        <InputGroup size="lg" className="my-3">
          <Form.Control
            placeholder="Search"
            aria-label="Search for employee"
            aria-describedby="basic-addon2"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={handleSearch}
          >
            Search
          </Button>
        </InputGroup>
      </div>
      {data.length === 0 ? (
        <div className="flex-grow-1 ">No data found</div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" sx={{ width: 0.01 }}>
                  <ToggleButton
                    value="check"
                    selected={selectAll}
                    onChange={handleSelectAll}
                    sx={{ padding: 0 }}
                  >
                    <CheckBox
                      color={selectAll ? "primary" : ""}
                      sx={{ color: !selectAll ? "white" : "" }}
                    />
                  </ToggleButton>
                </StyledTableCell>
                {columns.map((value, index) => {
                  return (
                    <StyledTableCell key={index} align="center">
                      {value.headerName}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              ).map((row, index) => (
                <StyledTableRow hover={true} key={row.id}>
                  <StyledTableCell align="center">
                    <ToggleButton
                      value="check"
                      selected={row.selected}
                      onChange={() => {
                        handleSelectRow(page * rowsPerPage + index);
                      }}
                      sx={{ padding: 0 }}
                    >
                      <CheckBox
                        color={row.selected ? "primary" : ""}
                        sx={{ color: !row.selected ? "white" : "" }}
                      />
                    </ToggleButton>
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.07 }}>
                    {row.details ? (
                      <Link to={`/employee?id=${row.id}`}>{row.id}</Link>
                    ) : (
                      row.id
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.2 }}>
                    {`${row.first_name} ${row.last_name}`}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.1 }}>
                    {row.date_of_birth}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.2 }}>
                    {row.address}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.1 }}>
                    {row.date_of_joining}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.07 }}>
                    {row.salary}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.15 }}>
                    {row.designation}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.1 }}>
                    {row.manager_id}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
