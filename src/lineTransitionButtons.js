import React, { useState } from "react";
import LineChart from "./charts/line";

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

const LineButtons = () => {
    const [filepath, setFilepath] = useState("/data/Eggs/Egg Ratio.csv"); // Set "eggs" as default
    const [subtitle, setSubtitle] = useState("Grade A Large eggs"); // Set "eggs" as default
    const [active, setActive] = useState("Eggs"); // Set active button styling


    const title = "What An Hour of Work Can Buy"; // Set title
    const monthly = true; // Set monthly

    const buttons = [ // Array to dynamically create buttons
        { label: "Eggs", path: "/data/Eggs/Egg Ratio.csv", subtitle: "Grade A Large eggs, per egg."},
        { label: "Bread", path: "/data/Bread/Bread Ratio.csv", subtitle: "White pan bread, per lb."},
        { label: "Milk", path: "/data/Milk/Milk Ratio.csv", subtitle: "Fresh whole milk, per gal."},
        { label: "Potato Chips", path: "/data/Potato Chips/Potato Chip Ratio.csv", subtitle: "Potato chips, per 16 oz."},
    ]

    return (
        <div>
            {<LineChart // Linechart component
                filepath={filepath}
                monthly={monthly}
                title={title}
                subtitle={subtitle}
            />}
            <div style={{ height: BUTTONS_HEIGHT }}>
                {buttons.map(( { label, path, subtitle }) => ( // For each obj in buttons array, create a button
                <button
                    key = {label}
                    style = {active === label ? activeButton : inactiveButton} // Give active styling if label matches active
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

export default LineButtons;
