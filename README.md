# Why is food so expensive nowadays?
A data visualization project exploring the potential causes behind the high prices of food today. Mainly uses React and D3.js.

To run the project, install the packages with `npm init` then run `npm start`.

## Data Sources
My spreadsheet containing my sources and original .csv files can be found [here](https://docs.google.com/spreadsheets/d/12Qcm4pZ3EbAPCV3ndg5vRBFeu_duk7GwUoJ_WrWvjAo/edit?usp=sharing). Some of the data may differ from what is in the repo (different column names, removed unnecessary data, etc.).

- **U.S. Bureau of Labor Statistics**
  - Consumer Price Index Average Price Data: https://data.bls.gov/PDQWeb/ap
  - Consumer Expenditures in 2023: https://www.bls.gov/opub/reports/consumer-expenditures/2023/
- **Federal Reserve Bank of St. Louis**
  - NJ Minimum Wage: https://fred.stlouisfed.org/data/STTMINWGNJ
    - Data is stated to be sourced from the U.S. Department of Labor
- **Statista**
  - Revenue of the online food delivery market in the United States from 2017 to 2029: https://www.statista.com/forecasts/891082/online-food-delivery-revenue-by-segment-in-united-states
  - Market share of leading online meal delivery companies in the United States as of March 2024: https://www.statista.com/statistics/1235724/market-share-us-food-delivery-companies/
- **McKinsey & Company**
  - Ordering in: The rapid evolution of food delivery: https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/ordering-in-the-rapid-evolution-of-food-delivery
 
## Development Workflow
- Research and collect data
- Look at examples of D3.js charts and how their data was formatted
  - If necessary, format data to mimic their organization and structure
- Take chart code and turn it into a React component
- Modify code to be re-usable (work with different .csv files, as long as they follow the same structure)
- Add extra features (tool tips, chart transitions via. buttons, etc.)
- Add story and stylize text elements with some CSS

## What I learned
- The basics of React (how to use `UseState`, define and pass in props, etc.)
  - It's advantages over HTML — For example, with my transition button components, instead of making each button individually, React and JS can take my data and make a button for each one
- How to work with D3.js
  - Parsing .csv files and their data
  - Modifying charts to add transitions
  - Modifying charts to be React components
  - Adding tooltips and using mouse events
    - Adding classes to the SVG elements created and interacting with them
