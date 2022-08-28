import { useEffect, useState } from "react";
import { TreeItem, treeItemClasses, TreeView } from "@mui/lab";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getEmployeesList, makeHeirarchy } from "../../utilities/Utilities";
import { ControlPoint, HighlightOff, RemoveCircle } from "@mui/icons-material";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { alpha, Collapse } from "@mui/material";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

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
  const [data, setData] = useLocalStorage("list", []);
  const [heirarchy, setHeirarchy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActive("heirarchy");
    async function populate() {
      const res = await getEmployeesList();
      setData([...res]);
      setLoading(false);
    }
    if (data.length === 0) {
      populate();
    }
    setHeirarchy(makeHeirarchy([...data]));
    setLoading(false);
  }, [setActive, setData, data]);

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
    <div className="employee-heirarchy d-flex justify-content-center py-5 h-100">
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
