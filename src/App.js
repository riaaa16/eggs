import './App.css';
import LineChart from './charts/LineChart';
import MultiLineChart from './charts/MultiLineChart';

function App() {
  return (
    <div className="App">
      <LineChart
        filepath={'/data/Eggs/Eggs, grade A, large, per doz. in NE avg.csv'}
        monthly={true}
        title={"Average Price of Eggs, per doz."}
        subtitle={"Grade A, large, for Northeast America"}
      />
      <LineChart
        filepath={'/data/Bread/Bread, white, pan, per lb. (453.6 gm) in NE avg..csv'}
        monthly={true}
        title={"Average Price of Bread, per lb."}
        subtitle={"White, pan, for Northeast America"}
      />
      <LineChart
        filepath={'/data/NJ Hourly Minimum Wage.csv'}
        title={"NJ Hourly Minimum Wage."}
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
