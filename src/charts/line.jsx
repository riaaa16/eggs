/*
D3 Line Chart Source Code: https://observablehq.com/@d3/line-chart/2
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { getMonthIndex } from "../convertMonth";

const LineChart = ({ filepath, monthly, title, subtitle }) => {
  const svgRef = useRef(); // Reference to the SVG element
  const [data, setData] = useState(null); // Store loaded CSV data
  const [prevData, setPrevData] = useState(null); // Store previous data for transitions
  const timing = 1000; // Timing for durations
  const easing = d3.easeQuadInOut; // Easing for transitions

  // Load data from CSV
  useEffect(() => {
    d3.csv(filepath) // Read and parse CSV
      .then((loadedData) => {
        const formattedData = []; // Create an empty array to store data in
  
        loadedData.forEach((row) => { // For each row
          const year = +row.Year; // Convert year to a number
  
          if (monthly) { // If monthly is true
          Object.keys(row).forEach((month) => { // for each value in row
            const price = parseFloat(row[month]); // Parse as float
            if (month !== "Year" && !isNaN(price)) { 
              formattedData.push({
                date: new Date(year, getMonthIndex(month)), // Convert year and month into date
                price : price,
              });
            }})
          } else {
            formattedData.push({
              date: new Date(year, null),
              price: parseFloat(row.Value),
            });           
          }
        });
  
        setPrevData(data); // Save current data
        setData(formattedData); // set formatted data as current data to use
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
      });
  }, [filepath, monthly]);

  // Render chart when data is available
  useEffect(() => {
    if (!data) return; // Skip rendering if data isn't loaded

    const width = 928;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Select the SVG element
    const svg = d3.select(svgRef.current);

    // Rendering data for first time (no previous data)
    if (!prevData) {
      svg.selectAll("*").remove(); // Clear previous chart

      // Create x-axis
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`);

      // Create y-axis
      const yAxis = svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`);

      // Append y-axis label
      yAxis.append("text")
        .attr("class", "y-label")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Value");

      // Create line path
      svg.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
      
    }

    // Define scales
    const x = d3.scaleUtc()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.price)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Define line generator
    const line = d3.line()
      .x((d) => x(d.date))
      .y((d) => y(d.price))
      .curve(d3.curveMonotoneX);

    // Update X-axis
    svg.select(".x-axis")
      .transition()
      .ease(easing)
      .duration(timing)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Update Y-axis
    svg.select(".y-axis")
      .transition()
      .ease(easing)
      .duration(timing)
      .call(d3.axisLeft(y))

    // Update grid lines
    const gridLines = svg.select(".grid-lines");
    gridLines.selectAll().remove();

    y.ticks().forEach((tick) => {
      gridLines.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", y(tick))
        .attr("y2", y(tick))
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.1)
    });

    // Transition line
    svg.select(".line")
      .datum(data)
      .transition()
      .ease(easing)
      .duration(timing)
      .attr("d", line);


  }, [data, prevData]); // Re-run effect when data changes

  return (
    <div>
      <h2 className="chart-title">{title}</h2>
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      {data ? (
        <svg
          ref={svgRef}
          width={928}
          height={500}
          style={{ border: "1px solid #ccc", background: "#fafafa" }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default LineChart;
