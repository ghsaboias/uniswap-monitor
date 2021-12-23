import './App.css';
import { createClient, useSubscription, defaultExchanges, subscriptionExchange } from 'urql'
import { createClient as createWSClient } from 'graphql-ws';
import { useEffect, useState } from 'react'
import Header from './components/Header';
import Swaps from './components/Swaps';

const APIURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const wsClient = createWSClient({
  url: APIURL,
});

const client = createClient({
  url: APIURL,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});


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

// const client = createClient({
//   url: APIURL
// })

function App() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    console.log('fetching');
    const response = await client.query(query).toPromise();
    // throws errors, giving up for today
    const response1 = await client.subscription(query1).toPromise();
    console.log(response1);
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
