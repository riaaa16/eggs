import './App.css';
import LineChart from './charts/LineChart';
import MultiLineChart from './charts/MultiLineChart';

function App() {
  return (
    <div className="App">
      <LineChart
        filepath={'/data/Eggs/Eggs, grade A, large, per doz. in NE avg.csv'}
        title={"Average Price of Eggs, per doz."}
        subtitle={"Grade A, large, for Northeast America"}
      />
      <LineChart
        filepath={'/data/Bread/Bread, white, pan, per lb. (453.6 gm) in NE avg..csv'}
        title={"Average Price of Bread, per lb."}
        subtitle={"White, pan, for Northeast America"}
      />
      <MultiLineChart
        csvFiles={[
              {
                filepath: "/data/Eggs/Eggs, grade A, large, per doz. in NE avg.csv",
                product: "eggs"
              },
              {
                filepath: "/data/Bread/Bread, white, pan, per lb. (453.6 gm) in NE avg..csv",
                product: "bread"
              },
              {
                filepath: "/data/Milk/Milk, fresh, whole, per gal. in NE avg..csv",
                product: "milk"
              },
              {
                filepath: "data/Potato Chips/Potato chips, per 16 oz. in NE avg..csv",
                product: "potato chips"
              }
          ]}
          title={"Average Prices of Grocery Items"}
          subtitle={"For Northeast America"}
        />
    </div>
  );
}

export default App;
