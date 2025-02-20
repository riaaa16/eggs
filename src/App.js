import './App.css';
import LineChart from './charts/LineChart';

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
    </div>
  );
}

export default App;
