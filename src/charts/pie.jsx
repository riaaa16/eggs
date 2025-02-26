/*
D3 Pie Chart Source Code: https://observablehq.com/@d3/pie-chart/2
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PieChart = ({filepath, title, subtitle}) => {
    const svgRef = useRef(); // Reference to SVG element
    const [data, setData] = useState(null); // Store loaded CSV data

    // Load data from CSV
    useEffect( () => {
        // Read and parse given CSV
        d3.csv(filepath)
            .then( (loadedData) => { // After loading CSV
                const filteredData = loadedData.map(
                    (d) => ({ // for each row (d)
                        name: String(d.Name).trim(), // Convert Name values to String and clean
                        value: +d.Value // Convert all values into numbers
                    })
                );

                setData(filteredData); // Use the filtered CSV instead
            })
            .catch( (error) => {
                console.error(`Error loading CSV: ${error}`);
            });
    }, [filepath]);

    // Render chart after loading data
    useEffect( () => {
        if (!data) return;

        // Specify the chart’s dimensions.
        const width = 928;
        const height = Math.min(width, 500);
        const margin = 40;

        // Create the color scale.
        const color = d3.scaleOrdinal(d3.schemeObservable10);

        // Create the pie layout and arc generator.
        const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

        const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - margin);

        const labelRadius = arc.outerRadius()() * 1.17;


        // A separate arc generator for labels.
        const arcLabel = d3.arc()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius);

        const arcs = pie(data);

        // Create the SVG container.
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Remove old SVG elements before drawing

        svg.attr("width", width + margin)
        .attr("height", height + margin)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        // Add a sector path for each value.
        svg.append("g")
            .attr("class", "slices")
            .attr("stroke", "white")
        .selectAll()
        .data(arcs)
        .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
        .append("title")
            .text(d => `${d.data.name}: ${d.value.toLocaleString("en-US")}%`);

        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        svg.append("g")
        .attr("text-anchor", "middle")
        .selectAll()
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0).append("tspan") // Edit number here to determine when the label should show
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => `${d.data.value}%`));

    }, [data]);

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

export default PieChart;