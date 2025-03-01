/*
D3 Diverging Stacked Bar Chart Source Code: https://observablehq.com/@d3/diverging-stacked-bar-chart/2
*/

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DivergingStackedBarChart = ({filepath, title, subtitle}) => {
    const svgRef = useRef(); // Reference to the SVG element
    const [data, setData] = useState(null); // Store loaded CSV data

    // Load data from CSV
    useEffect(() => {
        d3.csv(filepath) // Read and parse given CSV
            .then((loadedData) => { // After loading CSV
                const filteredData = loadedData.map(
                    (d) => ({
                        name: String(d.Name).trim(), // Convert Name values to String and clean
                        category: String(d.Category).trim(), // Convert Category values to String and clean
                        value: +d.Value, // Convert all values to number
                }));

                Object.assign(filteredData, { // Adding metadata
                    negative: "← Negative",
                    positive: "Positive →",
                    negatives: ["Contribution Margin", "Occupancy-"],
                    positives:[
                        "Customer Paid",
                        "Delivery Fees",
                        "Gross Margin",
                        "Platform Commission",
                        "Driver Tip",
                        "Cost of Goods Sold",
                        "Labor",
                        "Occupancy+"
                    ]
                });

                setData(filteredData);
            })
            .catch((error) => {console.error("Error loading CSV: ", error)});
    }, [filepath]);

    // Render chart after loading data
    useEffect(() => {
        if (!data) return;

        // Assign a valence to each category.
        const signs = new Map([].concat(
            data.negatives.map(d => [d, -1]),
            data.positives.map(d => [d, +1])
        ));

        // Compute the bias = sum of negative values for each candidate.
        const bias = d3.sort(
            d3.rollup(data, v => d3.sum(v, d => d.value * Math.min(0, signs.get(d.category))), d => d.name),
            ([, a]) => a
        );

        // Specify the chart’s dimensions, with a space of height 33px for each candidate.
        const width = 928;
        const margin = {top : 0, right : 30, bottom : 0, left : 130};
        const height = bias.length * 33 + margin.top + margin.bottom;

        // Prepare the stack; the values are stacked from the inside out, starting with more
        // moderate values and ending with the extreme values.
        const series = d3.stack()
            .keys([].concat(data.negatives.slice().reverse(), data.positives))
            .value(([, value], category) => signs.get(category) * (value.get(category) || 0))
            .offset(d3.stackOffsetDiverging)
        (d3.rollup(data, data => d3.rollup(data, ([d]) => d.value, d => d.category), d => d.name));

        // Construct the scales.
        const x = d3.scaleLinear()
            .domain(d3.extent(series.flat(2)))
            .rangeRound([margin.left, width - margin.right])

        const y = d3.scaleBand()
            .domain(bias.map(([name]) => name))
            .rangeRound([margin.top, height - margin.bottom])
            .padding(0.2)

        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain([].concat(data.negatives, data.positives))
            .range(d3.schemeSpectral[data.negatives.length + data.positives.length])

        // A function to format two decimal places, used both on the axis and in the tooltips.
        const formatValue = ((format) => (x) => format(Math.abs(x)))(d3.format(".2f"));

        // Create the SVG container.
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        svg.attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
        
        // Append a rect for each value, with a tooltip.
        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .attr("class", d => {return "category"})
            .selectAll("rect")
            .data(d => d.map(v => Object.assign(v, {key: d.key})))
            .join("rect")
            .attr("x", d => x(d[0]))
            .attr("y", ({data: [name]}) => y(name))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("height", y.bandwidth())
            .attr("class", d => {
                return String(d.key).replace(/\s+/g, "_");
            })
            .on("mouseover", function (event, d) {
                const catName = String(d3.select(this.parentNode).datum().key).replace(/\s+/g, "_"); // PULL CLASS NAME

                d3.selectAll(".category") // Select all categories
                    .selectChildren() // Select all children
                    .filter((d,i) => i !== catName) // Select children that DON'T match the class name
                    .style("opacity", 0.2); // Lower opacity

                d3.selectAll(`.${catName}`).style("opacity", 1); // Highlights selected category
            })
            .on("mouseleave", function (event, d) {
                d3.selectAll(".category").selectChildren().style("opacity", 1); // Return all to opacity 100%
            });

        // Create the axes.
        svg.append("g")
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x)
                .ticks(width / 80)
                .tickFormat(formatValue)
                .tickSizeOuter(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", x(0) + 20)
                .attr("y", -24)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(data.positive))
            .call(g => g.append("text")
                .attr("x", x(0) - 20)
                .attr("y", -24)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(data.negative));

        svg.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.selectAll(".tick").data(bias).attr("transform", ([name, min]) => `translate(${x(min)},${y(name) + y.bandwidth() / 2})`))
            .call(g => g.select(".domain").attr("transform", `translate(${x(0)},0)`));

    }, [data]);

    return (
        <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          {data ? (
            <svg
              ref={svgRef}
              width={928}
              height={200}
              style={{ border: "1px solid #ccc", background: "#fafafa" }}
            />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      );

};

export default DivergingStackedBarChart;