/*
D3 Line Chart, Multiple Series Source Code: https://observablehq.com/@d3/multi-line-chart/2

Example usage

    <MultiLineChart
    csvFiles={[
            {
            filepath: "",
            category: ""
            },
            {
            filepath: "",
            category: ""
            }
        ]}
        title={""}
        subtitle={""}
    />
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { getMonthIndex } from "../convertMonth";

const MultiLineChart = ({ csvFiles, title, subtitle }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  // Load CSV data for each file
  useEffect(() => {
    const loadCSV = async (obj) => {
        // for each obj in csvFiles
        try {
            const loadedData = await d3.csv(obj.filepath); // parse and read obj as csv
            return loadedData.flatMap((row) => {
              const year = +row.Year; // convert year to number
              if (obj.monthly) {
                return Object.keys(row)
                    .filter((value) => value !== "Year" && row[value]) // Skip empty values
                    .map((value) => ({
                    category: obj.category, // Associate with category name
                    date: new Date(year, getMonthIndex(value)), // Convert to Date object
                    price: parseFloat(row[value]), // Convert price to float
                    }));
              } else {
                return [{
                  category: obj.category,
                  date: new Date(year, null),
                  price: parseFloat(row.Value),
                }];
              }
            });
        } catch (error) {
            console.error(`Error loading CSV (${obj.filepath}):`, error);
        }
    };

    Promise.all(csvFiles.map(loadCSV)).then((results) => {
      setData(results.flat()); // Flatten arrays and update state
    });
  }, [csvFiles]);

  // Render D3 chart when data is available
  useEffect(() => {
    
    const width = 928;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Select the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous elements

    // Define scales
    const x = d3.scaleUtc().domain(d3.extent(data, (d) => d.date)).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.price)]).nice().range([height - margin.bottom, margin.top]);

    // Horizontal axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Vertical axis.
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Price ($)"));

    // Compute the points in pixel space as [x, y, z], where z is the name of the series.
    const points = data.map((d) => [x(d.date), y(d.price), d.category]);

    // Group the points by series.
    const groups = d3.rollup(points, v => Object.assign(v, {z: v[0][2]}), d => d[2]);

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeObservable10);

    // Draw the lines
    const line = d3.line();
    const path = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(groups.values())
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", line)
        .attr("stroke", d => colorScale(d[0][2])); // To color each line a different color

    // Add an invisible layer for the interactive tip.
    const dot = svg.append("g")
        .attr("display", "none");

    dot.append("circle")
        .attr("r", 2.5);

    dot.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -8);

    svg
        .on("pointerenter", pointerentered)
        .on("pointermove", pointermoved)
        .on("pointerleave", pointerleft)
        .on("touchstart", event => event.preventDefault());

    // When the pointer moves, find the closest point, update the interactive tip, and highlight
    // the corresponding line. Note: we don't actually use Voronoi here, since an exhaustive search
    // is fast enough.
    function pointermoved(event) {
        // Mouse moves across line
        const [xm, ym] = d3.pointer(event);
        const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
        const [x, y, k] = points[i];
        path.style("stroke", ({z}) => z === k ? null : "#ddd").filter(({z}) => z === k).raise();
        dot.attr("transform", `translate(${x},${y})`);
        dot.select("text").text(k);
        svg.property("value", data[i]).dispatch("input", {bubbles: true});
    }

    function pointerentered() {
        // Mouse enters line
        path.style("mix-blend-mode", null).style("stroke", "#ddd");
        dot.attr("display", null);
    }

    function pointerleft() {
        // Mouse leaves line
        path.style("mix-blend-mode", "multiply").style("stroke", null);
        dot.attr("display", "none");
        svg.node().value = null;
        svg.dispatch("input", {bubbles: true});
    }

  }, [data]);

  return (
    <div>
      <h2 className="chart-title">{title}</h2>
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      {data.length ? (
        <svg ref={svgRef} width={928} height={500} style={{ border: "1px solid #ccc", background: "#fafafa" }} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MultiLineChart;
