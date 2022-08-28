import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EmployeeDetail from "../screens/EmployeeDetail/EmployeeDetail";
import EmployeeHeirarchy from "../screens/EmployeeHeirarchy/EmployeeHeirarchy";
import EmployeesList from "../screens/EmployeesList/EmployeesList";

export default function Router(props) {
  const {setActive} = props;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/employeesList" element={<EmployeesList setActive={setActive} />} />
        <Route path="/employee" element={<EmployeeDetail setActive={setActive} />} />
        <Route path="/heirarchy" element={<EmployeeHeirarchy setActive={setActive} />} />
        <Route path="*" element={<Navigate to="/employeesList" />} />
      </Routes>
    </BrowserRouter>
  );
}
