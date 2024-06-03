"use client";
import * as d3 from "d3";
import CollapsibleTreeChart from "./CollapsibleTreeChart";
export default function Heirarchy() {
  const data = [
    {
      name: "Root",
      parent: null,
      component: <span className="color-red">hi</span>,
    },
    { name: "Root1", parent: "Root" },
    { name: "Child 1", parent: "Root1" },
    { name: "Child 2", parent: "Root1" },
    { name: "Grandchild 1.1", parent: "Child 1" },
    { name: "Grandchild 1.2", parent: "Child 1" },
    { name: "Grandchild 2.1", parent: "Child 2" },
  ];
  return (
    <div>
      Heirarchy
      <CollapsibleTreeChart data={data} />
    </div>
  );
}
