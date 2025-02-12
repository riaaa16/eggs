# eggs
## Question / Topic
How has the cost of common grocery items (eggs, bread, milk, potato chips) in America scaled with the minimum wage? As the cost of groceries rise, is the average U.S. consumer able to afford more or less?

## Data Sources
- **Hourly Minimum Wage Rates in NJ**
  - Source: Federal Reserve Bank of St. Louis
    - Data is stated to be sourced from the U.S. Department of Labor
  - Link: https://fred.stlouisfed.org/data/STTMINWGNJ
- **Average consumer prices of eggs, bread, milk, and potato chips**
  - Source: U.S. Bureau of Labor Statistics
  - Fact Sheet: https://www.bls.gov/cpi/factsheets/average-prices.htm
  - Data Retrieval: https://data.bls.gov/PDQWeb/ap
- **Amount of eggs, bread, milk, and potato chips you can afford per hour**
  - Source: Calculated using data from the above sources (U.S. Bureau of Labor Statistics and Federal Reserve Bank of St. Louis).
    - Eggs
      - Calculation: 12 Eggs x Hourly Minimum Wage / Average Price for 12 Eggs = # Eggs per Hour
      - The prices for years 2007 - 2015 are taken from the U.S. Cities instead of NE due to a lack of data
    - Bread
      - Calculation: Hourly Minimum Wage / Average Price for 1 lb. of Bread = # Bread per Hour, lbs.
    - Milk
      - Calculation: Hourly Minimum Wage / Average Price for 1 gal. of Milk = # Milk per Hour, gal.
      - The prices for years 2001 - 2006 are taken from the U.S. Cities instead of NE due to a lack of data
    - Potato Chips
      - Calculation: Hourly Minimum Wage / Average Price for 16 oz. of Potato Chips = # Potato Chips per Hour, 16 oz.
      - The prices for years 1995 and 2001-2002 are taken from the U.S. Cities instead of NE due to a lack of data

## Potential Visualizations
- Line Charts
- Bar Charts
- An interactive calculator where you enter your minimum wage and it will tell you how much eggs you could buy in x amount of years?
- Time Slider: shows the minimum wage and prices of eggs in NJ at a specific amount of time
