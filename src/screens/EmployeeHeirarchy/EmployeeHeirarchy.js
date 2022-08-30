import { useEffect, useState } from "react";
import { TreeItem, treeItemClasses, TreeView } from "@mui/lab";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getEmployeesList, makeHeirarchy } from "../../utilities/Utilities";
import { ControlPoint, HighlightOff, RemoveCircle } from "@mui/icons-material";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { alpha, Collapse } from "@mui/material";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import { Button, Form, InputGroup } from "react-bootstrap";

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha("#0000", 1)}`,
  },
}));

export default function EmployeeHeirarchy(props) {
  const { setActive } = props;
  const [fetchedList, setFetchedList] = useLocalStorage("list", []);
  const [data, setData] = useState([]);
  const [heirarchy, setHeirarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaryStart, setSalaryStart] = useState("0");
  const [salaryEnd, setSalaryEnd] = useState("0");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setActive("heirarchy");
    async function populate() {
      const res = await getEmployeesList();
      setFetchedList([...res]);
      setData([...res]);
      setLoading(false);
    }
    if (fetchedList.length === 0) {
      populate();
    }
    setLoading(false);
  }, [setActive, setData, setFetchedList, fetchedList.length]);

  useEffect(() => {
    setHeirarchy(makeHeirarchy([...data]));
  }, [data]);

  useEffect(() => {
    setData([...fetchedList])
  },[fetchedList])

  function handleSearch() {
    const reg = new RegExp(searchText, "i");
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

  function handleSalarySearch() {
    let searchResult = fetchedList.filter((obj) => {
      let salary = parseInt(obj.salary.split(",").join(""));
      const salaryS = parseInt(salaryStart);
      const salaryE = parseInt(salaryEnd);
      return salary >= salaryS && salary <= salaryE;
    });
    setData([...searchResult]);
  }

  const renderTree = (nodes) => (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={`${nodes.id}, ${nodes.full_name}, ${nodes.designation}`}
    >
      {Array.isArray(nodes.team)
        ? nodes.team.map((node) => renderTree(node))
        : null}
    </StyledTreeItem>
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="employee-heirarchy d-flex flex-column justify-content-center align-items-center py-5 h-100">
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
        <InputGroup size="lg" className="my-3">
          <Form.Control
            placeholder="Search"
            aria-label="Salary start"
            aria-describedby="basic-addon3"
            onChange={(e) => {
              setSalaryStart(e.target.value);
            }}
          />
          <Form.Control
            placeholder="Search"
            aria-label="Salary end"
            aria-describedby="basic-addon4"
            onChange={(e) => {
              setSalaryEnd(e.target.value);
            }}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={handleSalarySearch}
          >
            Search
          </Button>
        </InputGroup>
      </div>
      {data.length === 0 ? (
        <div className="flex-grow-1">Couldn't find data</div>
      ) : (
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<RemoveCircle />}
          defaultExpanded={["EMP001"]}
          defaultExpandIcon={<ControlPoint />}
          defaultEndIcon={<HighlightOff />}
          sx={{ flexGrow: 1, maxWidth: 700, textAlign: "start" }}
        >
          {heirarchy.map((node) => renderTree(node))}
        </TreeView>
      )}
    </div>
  );
}
