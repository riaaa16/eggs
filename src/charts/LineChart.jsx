/*
D3 Line Chart Source Code: https://observablehq.com/@d3/line-chart/2
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const LineChart = ({ filepath, title, subtitle }) => {
  const svgRef = useRef(); // Reference to the SVG element
  const [data, setData] = useState(null); // Store loaded CSV data

  // Load data from CSV
  useEffect(() => {
    d3.csv(filepath)
      .then((loadedData) => {
        const formattedData = [];
  
        loadedData.forEach((row) => {
          const year = +row.Year;
  
          Object.keys(row).forEach((month) => {
            const price = parseFloat(row[month]);
            if (month !== "Year" && !isNaN(price)) {
              formattedData.push({
                date: new Date(year, getMonthIndex(month)),
                price : price,
              });
            }
          });
        });
  
        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
      });
  }, [filepath]);

  /* 
  Helper Function
  Converts month names (Jan, Feb) to numbers (0-11)
   */
  const getMonthIndex = (month) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months.indexOf(month);
  };

  // Render chart when data is available
  useEffect(() => {
    if (!data) return; // Skip rendering if data isn't loaded

    const width = 928;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Select the SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

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

    // Append X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Append Y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.left - margin.right)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Price ($)")
      );

    // Append the line path
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  }, [data]); // Re-run effect when data changes

  return (
    <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
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
