/*
D3 Stacked Bar Chart Source Code: https://observablehq.com/@d3/stacked-bar-chart/2
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const StackedBarChart = ({filepath, title, subtitle}) => {
    const svgRef = useRef(); // Reference to the SVG element
    const [data, setData] = useState(null); // Store loaded CSV data

    // Load data from CSV
    useEffect(() => {
        d3.csv(filepath) // Read and parse given CSV
            .then((loadedData) => { // After loading CSV
                const categories = loadedData.columns.slice(1);

                const filteredData = loadedData.map(
                    (d) => { // For each row (d)
                        const row = { year: +d.Year }; // Convert year into a number

                        for (let category of categories) {
                            row[category] = +d[category]; // Dynamically set the category names as a key
                        }
        
                        return row;
                    }
                );

                setData(filteredData); // Use filtered CSV data instead.
            })
            .catch((error) => {console.error(`Error loading CSV: ${error}`)});
    }, [filepath]);

    // Render chart after loading data
    useEffect( () => {
        if (!data) return;

        const keysList = Object.keys(data[0]);
        const categories = keysList.slice(1);

        // Chart dimensions
        const width = 928;
        const height = 500;
        const margin = {top : 20, right : 10, bottom : 30, left : 40};
        
        // Create SVG
        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove(); // Clear previous chart

        // Append SVG
        svg.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .append("g")
        .attr("style", "max-width: 100%; height: auto;");

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const groups = data.map(d => (d.year));

        // Define X scale
        const x = d3.scaleBand()
            .domain(groups)
            .range([margin.left, width - margin.right])
            .padding(0.2);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Define Y scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.sum(categories, key => +d[key]))])
            .rangeRound([height - margin.bottom, margin.top]);

        // Add Y axis
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
                      .text("↑ Revenue ($)")
                  );

        // Color palette
        const color = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeCategory10);

        // Stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(categories)
            (data);
            
        // Append bars 
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("class", d => {
                const className = String(d.key).trim().replace(" ", "_"); // Trim Category name and replace whitespace with _
                return className;
            })
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // Enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
                .attr("x", d => x(d.data.year))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width",x.bandwidth())
                .attr("class", d => {
                        return "rectangle"; // Assign class .rectangle to all rectangles
                }) // Add a class to each subgroup
            .on("mouseover", function (event, d) { // On mouse-over
                const catName = d3.select(this.parentNode).datum().key; // PULL CLASS NAME

                // const test = d.data[catName]; // PULL VALUE WITH CLASS NAME AS REFERENCE

                const className = catName.trim().replace(" ", "_"); // TRIM CLASS NAME AND REPLACE WHITESPACE WITH _

                d3.selectAll(".rectangle").style("opacity", 0.2); // Lowers opacity of everything

                d3.selectAll(`.${className}`).selectAll(".rectangle").style("opacity",1); // Highlights selected category
            })
            .on("mouseleave", function (event, d) { // On mouse-leave
                d3.selectAll(".rectangle").style("opacity", 1); // Return all to opacity 100%
            });

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

};

export default StackedBarChart;