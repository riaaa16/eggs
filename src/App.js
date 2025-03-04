import './App.css';
import LineChart from './charts/line';
import MultiLineChart from './charts/multiLine';
import PieChart from './charts/pie';
import StackedBarChart from './charts/stackedBar';
import DivergingStackedBarChart from './charts/divergingStackedBar';
import SmallMultiplesChart from './charts/smallMultiLine';
import TransitionButtons from './transitionButtons';

function App() {
  const groceryPrices = [ // for MultiLineChart
    {filepath: "/data/Eggs/Eggs, grade A, large, per doz. in NE avg.csv",
    category: "eggs", monthly: true},
    {filepath: "/data/Bread/Bread, white, pan, per lb. (453.6 gm) in NE avg..csv",
      category: "bread", monthly: true},
    {filepath: "/data/Milk/Milk, fresh, whole, per gal. in NE avg..csv",
    category: "milk", monthly: true},
    {filepath: "data/Potato Chips/Potato chips, per 16 oz. in NE avg..csv",
    category: "potato chips", monthly: true}
];

  const productRatio = [ // To create buttons for Product Ratio
    { label: "Eggs", path: "/data/Eggs/Egg Ratio.csv", subtitle: "Grade A Large eggs, per egg."},
    { label: "Bread", path: "/data/Bread/Bread Ratio.csv", subtitle: "White pan bread, per lb."},
    { label: "Milk", path: "/data/Milk/Milk Ratio.csv", subtitle: "Fresh whole milk, per gal."},
    { label: "Potato Chips", path: "/data/Potato Chips/Potato Chip Ratio.csv", subtitle: "Potato chips, per 16 oz."},
  ];

  const spendDistribution = [ // To create buttons for Spending Distribution
    { label: "2020", path: "/data/Spending Distribution/2020.csv", subtitle: "How the avg. American consumer spent their money in 2020."},
    { label: "2021", path: "/data/Spending Distribution/2021.csv", subtitle: "How the avg. American consumer spent their money in 2021."},
    { label: "2022", path: "/data/Spending Distribution/2022.csv", subtitle: "How the avg. American consumer spent their money in 2022."},
    { label: "2023", path: "/data/Spending Distribution/2023.csv", subtitle: "How the avg. American consumer spent their money in 2023."},
  ];

  return (
    <div className="App">
      <MultiLineChart
        csvFiles={groceryPrices}
          title={"Average Prices of Grocery Items"}
          subtitle={"For Northeast America"}
        />

      <LineChart
        filepath={'/data/NJ Hourly Minimum Wage.csv'}
        title={"NJ Hourly Minimum Wage."}
      />

      <TransitionButtons
        type = {"line"}
        buttons = {productRatio}
        monthly = {false}
        title = {"What an Hour of Work Affords"}
      />

      <TransitionButtons
        type = {"bar"}
        buttons = {spendDistribution}
        monthly = {false}
        title = {"Spending Distribution"}
      />

      <StackedBarChart
        filepath={'/data/Allocation of money spent on food.csv'}
        title={"Food Spending Distribution"}
      />  

      <StackedBarChart
        filepath={'/data/Online food delivery market revenue, 2017 - 2029.csv'}
        title={"Online Food Delivery Market Revenue"}
        unit={" bn"}
      />

      <PieChart
          filepath={"/data/Online food delivery market share, 2024.csv"}
          title={"Online Food Delivery Market Share"}
      />

      <DivergingStackedBarChart
        filepath={"/data/Restaurant unit economics.csv"}
        title={"Restaurant unit economics"}
      />
    </div>
  );
}

export default App;
