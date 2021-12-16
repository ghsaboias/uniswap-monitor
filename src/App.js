import './App.css';
import { createClient } from 'urql'
import { useEffect, useState } from 'react'
import Swaps from './components/Swaps';
import Header from './components/Header';

const APIURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const query = `
  {
    swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      amount0
      amount1
      amountUSD
      transaction {
        id
      }
    }
  }
  `


const client = createClient({
  url: APIURL
})

function App() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    fetchData();
    console.log('useEffect');
  }, []);

  async function fetchData() {
    console.log('fetching');
    const response = await client.query(query).toPromise();
    const { data } = response;
    console.log(data);
    const { swaps } = data;
    setSwaps(swaps);
  }

  return (
    <div className="App">
      <Header />
      <Swaps
        swaps={ swaps }
      />
    </div>
  );
}

export default App;
