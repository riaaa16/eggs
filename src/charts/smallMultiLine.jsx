/**
D3 Small Multiple Lines Chart Source Code: https://d3-graph-gallery.com/graph/line_smallmultiple.html
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { getMonthIndex } from "../convertMonth";

const SmallMultiplesChart = ({ csvFiles, title, subtitle }) => {
  const svgRef = useRef(); // Reference to the SVG element
  const [data, setData] = useState([]); // Store loaded CSV data
  const [categories, setCategories] = useState([]); // Store categories
  const [dimensions] = useState({ // Store dimensions
    width: 232,
    height: 210,
    margin: { top: 30, right: 10, bottom: 30, left: 50 }
  });

  // Load CSV data for each file
  useEffect(() => {
    const loadCSV = async (obj) => { // For each csv
      try {
        const loadedData = await d3.csv(obj.filepath); // Read and parse CSV
        return loadedData.flatMap((row) => { // For each row
          const year = +row.Year; // Convert year to a number
          if (obj.monthly) { // If monthly = true
            return Object.keys(row)
              .filter((value) => value !== "Year" && row[value]) // Filter for rows that aren't Year and have a value
              .map((value) => ({
                category: obj.category, // Set category
                date: new Date(year, getMonthIndex(value)), // Set date
                value: parseFloat(row[value]), // Set value
              }));
          } else { // If yearly
            return [{
              category: obj.category, // Set category
              date: new Date(year, 0), // Set date
              value: parseFloat(row.Value), // Set value
            }];
          }
        });
      } catch (error) {
        console.error(`Error loading CSV (${obj.filepath}):`, error);
      }
    };

    Promise.all(csvFiles.map(loadCSV)).then((results) => {
      const flattenedData = results.flat().filter(d => d && !isNaN(d.value)); // Flatten array and filter for numeric values only
      setData(flattenedData); // Set data
      
      // Extract unique categories
      const uniqueCategories = [...new Set(flattenedData.map(d => d.category))];
      setCategories(uniqueCategories); // Set categories
    });
  }, [csvFiles]);

  // Render D3 charts when data is available
  useEffect(() => {
    const svg = d3.select(svgRef.current); // Use SVG ref
    svg.selectAll("*").remove(); // Clear all SVG styling
    
    if (!data) return; // If there is no data, return

    const { width, height, margin } = dimensions; // Unpack variables
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const groupedData = d3.group(data, (d) => d.category); // Group data based on category
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

    // X scale
    const x = d3.scaleUtc()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, innerWidth]);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const chartContainer = svg.selectAll(".chart")
      .data(groupedData)
      .enter()
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    chartContainer.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(innerWidth / 80).tickSizeOuter(0));

    // Y axis
    chartContainer.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Lines
    chartContainer.append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => colorScale(d[0]))
      .attr("stroke-width", 1.9)
      .attr("d", (d) => d3.line()
        .x((d) => x(d.date))
        .y((d) => y(d.value))
        (d[1])
      );

    // Category labels
    chartContainer.append("text")
      .attr("y", -5)
      .attr("x", innerWidth/2)
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .text((d) => d[0])
      .style("fill", (d) => colorScale(d[0]));

  }, [data, categories, dimensions]);

  return (
    <div>
      <h2 className="chart-title">{title}</h2>
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      {data ? <div ref={svgRef}></div> : <p>Loading data...</p>}
    </div>
  );
};

export default SmallMultiplesChart;