import axios from "axios";

export async function getEmployeesList() {
  try {
    const res = await axios.get(
      "https://opensheet.elk.sh/1gH5Kle-styszcHF2G0H8l1w1nDt1RhO9NHNCpHhKK0M/employees"
    );
    if (res.status === 200 && res.data.length > 0) {
      return res.data;
    }
    throw new Error("No data received");
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getEmployeeDetails(URL, firstname, dob) {
  try {
    const res = await axios.get(URL);
    if (res.status === 200 && res.data.length > 0) {
      return res.data.find(
        (val, idx) => val.first_name === firstname && val.date_of_birth === dob
      );
    }
    throw new Error("No data received");
  } catch (err) {
    console.log(err);
    return [];
  }
}

export function makeHeirarchy(d) {
  const data = d;
  let memo1 = {};
  let memo2 = {};
  data.forEach((val, ind) => {
    memo1[val.id] = val;
    if (val.manager_id in memo2) memo2[val.manager_id].push(val);
    else memo2[val.manager_id] = [val];
  });
  let heirarchy = [];
  let memo = [];
  let roots = data.filter(
    (val, index) => val.manager_id === "" || memo1[val.manager_id] == null
  );
  roots.forEach((root) => {
    let obj = {};
    obj["id"] = root.id;
    obj["full_name"] = root.first_name + " " + root.last_name;
    obj["designation"] = root.designation;
    obj["salary"] = root.salary;
    heirarchy.push(obj);
    memo.push(obj);
  });
  for (let i = 0; i < memo.length; i++) {
    let node = memo[i];
    const children = memo2[node.id];
    if (children == null) {
      continue;
    }
    node.team = [];
    children.forEach((val) => {
      const newObj = {};
      newObj["id"] = val.id;
      newObj["full_name"] = `${val.first_name} ${val.last_name}`;
      newObj["designation"] = val.designation;
      newObj["salary"] = val.salary;
      node.team.push(newObj);
      memo.push(newObj);
    });
  }
  return heirarchy;
}
