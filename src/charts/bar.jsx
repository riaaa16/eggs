/*
D3 Bar Chart Source Code: https://observablehq.com/@d3/bar-chart/2
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ filepath, title, subtitle }) => {
    const svgRef = useRef(); // Reference to SVG element
    const [data, setData] = useState(null); // Store loaded CSV data

    // Load data from CSV
    useEffect(() => {
        d3.csv(filepath) // Read and parse CSV
        .then((loadedData) => {
            const formattedData = loadedData.map(
                (row) => ({ // For each row
                    name: String(row.name).trim(), // Convert name values to String
                    value: +row.value // Convert values to number
            }));
            setData(formattedData); // Use filtered CSV data instead
        })
        .catch((error) => {
            console.error("Error loading CSV:", error);
        });
    }, [filepath]); // Re-run when filepath changes


    // Render chart after loading data
    useEffect(() => {
        if (!data) return;

        const width = 928;
        const height = 500;
        const margin = { top : 30, right : 0, bottom : 30, left : 40};
      
        // Declare the x (horizontal position) scale.
        const x = d3.scaleBand()
            .domain(d3.groupSort(data, ([d]) => -d.value, (d) => d.name)) // descending value
            .range([margin.left, width - margin.right])
            .padding(0.1);
        
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .range([height - margin.bottom, margin.top]);
      
        // Create the SVG container.
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        const categories = data.map(d => (d.name));
        const color = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);

        // Create formatter
        const f =  d3.format(".2f");

        // Create tooltip
        const tooltip = d3.select("body").selectAll(".tooltip").data([0])
            .join("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("border-radius", "4px")
            .style("padding", "8px")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
            .style("font-size", "12px")
            .style("opacity", 0);
      
        // Add a rect for each bar.
        svg.append("g")
          .selectAll()
          .data(data)
          .join("rect")
            .attr("fill", (d) => (color(d.name)))
            .attr("x", (d) => x(d.name))
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => y(0) - y(d.value))
            .attr("width", x.bandwidth())
            .attr("class", (d) => "rect")
            .on("mouseover", function(event, d) {
                const barName = String(d.name); // Pull name

                d3.selectAll(".rect").filter((d) => d.name !== barName).style("opacity", 0.2); // Lower opacity of all other bars

                tooltip // Show tooltip
                    .style("opacity", 0.9)
                    .html(`<strong>${barName}:</strong> ${f(d.value)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event) {
                tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function(event) {
                d3.selectAll(".rect").style("opacity", 1.00); // Return all opacity to 100%
                tooltip.style("opacity", 0); // Hide tooltip
            });
      
        // Add the x-axis and label.
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text") // Style the labels
            .attr("fill", "currentColor")
            .style("font-style", "normal")
            .style("font-size", "10px")
            .style("font-kerning", "auto");
      
        // Add the y-axis and label, and remove the domain line.
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format(f)))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Value (%)"));
    });

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

 }

 export default BarChart;