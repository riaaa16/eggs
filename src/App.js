import './App.css';
import LineChart from './charts/line';
import MultiLineChart from './charts/multiLine';
import PieChart from './charts/pie';
import StackedBarChart from './charts/stackedBar';

function App() {
  return (
    <div className="App">
      <StackedBarChart
        filepath={'/data/Online food delivery market revenue, 2017 - 2029.csv'}
        title={"Online Food Delivery Market Revenue"}
      />
      <LineChart
        filepath={'/data/NJ Hourly Minimum Wage.csv'}
        title={"NJ Hourly Minimum Wage."}
      />
      <PieChart
          filepath={"/data/Online food delivery market share, 2024.csv"}
          title={"Online Food Delivery Market Share"}
      />
      <MultiLineChart
        csvFiles={[
              {
                filepath: "/data/Eggs/Eggs, grade A, large, per doz. in NE avg.csv",
                category: "eggs",
                monthly: true
              },
              {
                filepath: "/data/Bread/Bread, white, pan, per lb. (453.6 gm) in NE avg..csv",
                category: "bread",
                monthly: true
              },
              {
                filepath: "/data/Milk/Milk, fresh, whole, per gal. in NE avg..csv",
                category: "milk",
                monthly: true
              },
              {
                filepath: "data/Potato Chips/Potato chips, per 16 oz. in NE avg..csv",
                category: "potato chips",
                monthly: true
              }
          ]}
          title={"Average Prices of Grocery Items"}
          subtitle={"For Northeast America"}
        />
        <MultiLineChart
          csvFiles={[
            {
              filepath: "/data/Eggs/Egg Ratio.csv",
              category: "eggs",
            },
            {
              filepath: "/data/Bread/Bread Ratio.csv",
              category: "bread",
            },
            {
              filepath: "/data/Milk/Milk Ratio.csv",
              category: "milk",
            },
            {
              filepath: "/data/Potato Chips/Potato Chip Ratio.csv",
              category: "potato chips",
            },
          ]}
          title={"Amount of groceries you can afford with one hour of work"}
          subtitle={"Based off of average prices and minimum wage"}
        />
    </div>
  );
}

export default App;
