import React, { useState, useEffect } from "react";
import LineChart from "./charts/line";
import BarChart from "./charts/bar";

const BUTTONS_HEIGHT = 50;

const inactiveButton = { // Styling nor inactive buttons
    border: "1.5px solid #9e0142",
    borderRadius: "3px",
    padding: "4px 8px",
    margin: "10px 2px",
    fontSize: 14,
    color: "#9e0142",
};

const activeButton = { // Styling for active buttons
    ...inactiveButton,
    backgroundColor: "#9e0142",
    color: "white",
    fontWeight: "bold"
}

const TransitionButtons = ({ type, buttons, monthly, title}) => {
    const firstChart = buttons[0]; // Set firstChart to first object in Array

    // Initialize state to first chart's data
    const [filepath, setFilepath] = useState(firstChart.path);
    const [subtitle, setSubtitle] = useState(firstChart.subtitle);
    const [active, setActive] = useState(firstChart.label);

    useEffect(() => {
        setFilepath(firstChart.path); // Set filepath to first
        setSubtitle(firstChart.subtitle); // Set subtitle to first
        setActive(firstChart.label); // Set active  to first
    }, [buttons]);

    const chart = { // Object returns correct component based on type
        "line" : <LineChart
            filepath={filepath}
            monthly={monthly}
            title={title}
            subtitle={subtitle}
        />,
        "bar" : <BarChart
            filepath={filepath}
            title={title}
            subtitle={subtitle}
        />
    };

    return (
        <div>
            {chart[type]}
            <div style={{ height: BUTTONS_HEIGHT }}>
                {buttons.map(( { label, path, subtitle }) => ( // For each obj in buttons array, create a button
                <button
                    key = {label}
                    className = {active === label ? 'active-chart-btn' : 'inactive-chart-btn'} // Give active styling if label matches active
                    onClick = {() => {
                        setFilepath(path);
                        setSubtitle(subtitle);
                        setActive(label);
                    }}
                >{label}</button> // Button text is whatever label is
                ))}
            </div>
        </div>
    );
};

export default TransitionButtons;
