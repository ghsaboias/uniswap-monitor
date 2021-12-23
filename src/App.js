import './App.css';
import { createClient, useSubscription, defaultExchanges, subscriptionExchange } from 'urql'
import { useEffect, useState } from 'react'
import Swaps from './components/Swaps';
import Header from './components/Header';

const APIURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const query = `
  {
    swaps(first: 20, orderBy: timestamp, orderDirection: desc) {
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

  // should make subscription, still need to figure out how it works
  const query1 = `
    subscription swaps {
      swaps(first: 20, orderBy: timestamp, orderDirection: desc) {
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
  }, []);

  async function fetchData() {
    console.log('fetching');
    const response = await client.query(query).toPromise();
    const { data } = response;
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
