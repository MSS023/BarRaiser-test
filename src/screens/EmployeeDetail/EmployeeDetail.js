import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getEmployeeDetails } from "../../utilities/Utilities";

const columns = [
  { field: "field", headerName: "Field" },
  { field: "value", headerName: "Value" },
];

const rows = {
  first_name: "First Name",
  last_name: "Last Name",
  date_of_birth: "DOB",
  address: "Address",
  date_of_joining: "Date of Joining",
  salary: "Salary",
  designation: "Designation",
};

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
export default function EmployeeDetail(props) {
  const [query, setQuery] = useSearchParams();
  const [fetchedData, setFetchedData] = useLocalStorage("list", []);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function populate() {
      const reqId = query.get("id");
      const fetchedEmployee = fetchedData.find((val) => val.id === reqId);
      const res = await getEmployeeDetails(
        fetchedEmployee.details,
        fetchedEmployee.first_name,
        fetchedEmployee.date_of_birth
      );
      setData({ ...res });
      setLoading(false);
    }
    populate();
  }, [fetchedData, setFetchedData, setQuery, query]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="employee-detail w-100 h-100">
      <TableContainer
        component={Paper}
        className="d-flex align-items-center justify-content-center h-100 px-3"
      >
        <Table sx={{maxWidth: 700}} aria-label="customized table">
          <TableHead>
            <TableRow>
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
            {Object.keys(data).map((row, key) => (
              <StyledTableRow hover={true} key={key}>
                <StyledTableCell align="center">{rows[row]}</StyledTableCell>
                <StyledTableCell align="center">{data[row]}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
