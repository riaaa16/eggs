import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ filepath, title, subtitle }) => {
    const svgRef = useRef(); // Reference to SVG element
    const [data, setData] = useState(null); // Store loaded CSV data
    const [prevData, setPrevData] = useState(null); // Store previous data for transitions
    const timing = 1000; // Timing for durations
    const easing = d3.easeQuadInOut; // Easing for transitions

    // Load data from CSV
    useEffect(() => {
        d3.csv(filepath) // Read and parse CSV
        .then((loadedData) => {
            const formattedData = loadedData.map(
                (row) => ({ // For each row
                    name: String(row.name).trim(), // Convert name values to String
                    value: +row.value // Convert values to number
            }));
            setPrevData(data); // Save current data
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
        const margin = { top: 30, right: 0, bottom: 30, left: 40 };

        // Color scale
        const categories = data.map(d => (d.name));
        const color = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);

        // Create formatter
        const f = d3.format(".2f");

        // Create the SVG container.
        const svg = d3.select(svgRef.current);

        // Rendering data for first time (no previous data)
        if (!prevData) {
            svg.selectAll("*").remove(); // Clear previous chart

            // Create x-axis
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height - margin.bottom})`);

            // Create y-axis
            const yAxis = svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left},0)`);

            // Append y-axis label
            yAxis.append("text")
                .attr("class", "y-label")
                .attr("transform", `translate(${margin.left},0)`)
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Value (%)");

            // Create container for rectangles
            svg.append("g")
                .attr("class", "bars");
        }

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
      
        // Define scales
        const x = d3.scaleBand()
            .domain(d3.groupSort(data, ([d]) => -d.value, (d) => d.name)) // descending value
            .range([margin.left, width - margin.right])
            .padding(0.2);
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .range([height - margin.bottom, margin.top]);

        // Update X-axis
        svg.select(".x-axis")
            .transition()
            .ease(easing)
            .duration(timing)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text") // Style the labels
            .attr("fill", "currentColor")
            .style("font-style", "normal")
            .style("font-size", "10px")
            .style("font-kerning", "auto");

        // Update Y-axis
        svg.select(".y-axis")
            .transition()
            .ease(easing)
            .duration(timing)
            .call(d3.axisLeft(y).tickFormat(f));

        // Handle bar transitions with proper data binding
        const bars = svg.select(".bars").selectAll("rect")
            .data(data, d => d.name);
            
        // Remove exiting bars
        bars.exit()
            .transition()
            .duration(timing / 2)
            .attr("y", height - margin.bottom)
            .attr("height", 0)
            .remove();
            
        // Add new bars
        bars.enter()
            .append("rect")
            .attr("x", d => x(d.name))
            .attr("y", height - margin.bottom)
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .attr("fill", d => color(d.name))
            .merge(bars) // Update both new and existing bars
            .transition()
            .ease(easing)
            .duration(timing)
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth())
            .attr("fill", d => color(d.name));
            
        // Add event listeners separately (after transitions complete)
        svg.select(".bars").selectAll("rect")
            .on("mouseover", function(event, d) {
                const barName = d.name;
                
                d3.select(this).attr("opacity", 0.8);
                svg.select(".bars").selectAll("rect")
                    .filter(rect => rect.name !== barName)
                    .attr("opacity", 0.2);

                tooltip
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
            .on("mouseleave", function() {
                svg.select(".bars").selectAll("rect").attr("opacity", 1);
                tooltip.style("opacity", 0);
            });

    }, [data, prevData]);

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
}

export default BarChart;