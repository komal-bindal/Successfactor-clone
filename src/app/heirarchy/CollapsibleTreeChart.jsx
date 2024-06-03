import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CollapsibleTreeChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.selectAll("*").remove(); // Clear previous content

    // Stratify and sort the data
    try {
      const stratify = d3
        .stratify()
        .id((d) => d.name)
        .parentId((d) => d.parent);

      const root = stratify(data).sort(
        (a, b) => a.height - b.height || a.id.localeCompare(b.id)
      );

      const xOffset = 100; // Adjust this value to shift the root node horizontally
      root.x0 = height / 2;
      root.y0 = xOffset;

      const treeLayout = d3.tree().size([height, width - 160]);

      const update = (source) => {
        const treeData = treeLayout(root);

        const nodes = treeData.descendants().reverse();
        const links = treeData.links();

        nodes.forEach((d) => {
          d.y = d.depth * 180 + xOffset;
        });

        const node = svg
          .selectAll("g.node")
          .data(nodes, (d) => d.id || (d.id = ++i));

        const nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
          .on("click", click);

        nodeEnter
          .append("circle")
          .attr("class", "node")
          .attr("r", 1e-6)
          .style("fill", (d) => (d._children ? "lightsteelblue" : "#fff"));

        nodeEnter
          .append("text")
          .attr("dy", ".35em")
          .attr("x", (d) => (d.children || d._children ? -13 : 13))
          .attr("text-anchor", (d) =>
            d.children || d._children ? "end" : "start"
          )
          .text((d) => d.data.name)
          .clone(true)
          .lower() // Ensures text is behind other elements
          .attr("stroke-linejoin", "round") // Ensures rounded edges around text
          .attr("stroke-width", 3) // Adjust as needed
          .attr("stroke", "white"); // Color of the stroke should match background

        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate
          .transition()
          .duration(200)
          .attr("transform", (d) => `translate(${d.y},${d.x})`);

        nodeUpdate
          .select("circle.node")
          .attr("r", 10)
          .style("fill", (d) => (d._children ? "lightsteelblue" : "#fff"))
          .attr("cursor", "pointer");

        const nodeExit = node
          .exit()
          .transition()
          .duration(200)
          .attr("transform", (d) => `translate(${source.y},${source.x})`)
          .remove();

        nodeExit.select("circle").attr("r", 1e-6);

        nodeExit.select("text").style("fill-opacity", 1e-6);

        const link = svg.selectAll("path.link").data(links, (d) => d.target.id);

        const linkEnter = link
          .enter()
          .insert("path", "g")
          .attr("class", "link")
          .style("fill", "none")
          .style("stroke", "red")
          .style("stroke-width", "2px")
          .attr("d", (d) => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal(o, o);
          });

        const linkUpdate = linkEnter.merge(link);

        linkUpdate
          .transition()
          .duration(200)
          .attr("d", (d) => diagonal(d.source, d.target));

        link
          .exit()
          .transition()
          .duration(200)
          .attr("d", (d) => {
            const o = { x: source.x, y: source.y };
            return diagonal(o, o);
          })
          .remove();

        nodes.forEach((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });

        function diagonal(s, d) {
          return `M${s.y},${s.x}C${(s.y + d.y) / 2},${s.x} ${(s.y + d.y) / 2},${
            d.x
          } ${d.y},${d.x}`;
        }

        function click(event, d) {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        }
      };

      let i = 0;
      update(root);
    } catch (error) {
      console.error("Error stratifying data:", error);
    }
  }, [data]);

  return <svg ref={svgRef} width="800" height="600"></svg>;
};

export default CollapsibleTreeChart;
