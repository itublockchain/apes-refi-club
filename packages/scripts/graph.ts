const { request, gql, GraphQLClient } = require('graphql-request'); 


async function main() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
  
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: 'Bearer MY_TOKEN',
      },
    })

    const VARIABLE = {"id": "0x4d224452801aced8b2f0aebe155379bb5d594381", "eth": "1"}
  
    const ETH_PRICE_QUERY = gql`
  query($id:String!, $eth: String!){
    token(id: $id) {
      derivedETH
    }
    bundle(id: $eth){
        ethPriceUSD
    }
}
`

    const data = await graphQLClient.request(ETH_PRICE_QUERY, VARIABLE)
    const USDPrice = data.bundle.ethPriceUSD * data.token.derivedETH
    console.log(JSON.stringify(data, undefined, 2))
    console.log("USD Price: ", USDPrice)
  }
  
  main().catch((error) => console.error(error))