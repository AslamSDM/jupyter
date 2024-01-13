export const PoolLensabi = [
  {
    inputs: [
      { internalType: "address", name: "poolRegistryAddress", type: "address" },
    ],
    name: "getAllPools",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "address", name: "comptroller", type: "address" },
          { internalType: "uint256", name: "blockPosted", type: "uint256" },
          { internalType: "uint256", name: "timestampPosted", type: "uint256" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string", name: "logoURL", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "address", name: "priceOracle", type: "address" },
          { internalType: "uint256", name: "closeFactor", type: "uint256" },
          {
            internalType: "uint256",
            name: "liquidationIncentive",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minLiquidatableCollateral",
            type: "uint256",
          },
          {
            components: [
              { internalType: "address", name: "vToken", type: "address" },
              {
                internalType: "uint256",
                name: "exchangeRateCurrent",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "supplyRatePerBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "borrowRatePerBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "reserveFactorMantissa",
                type: "uint256",
              },
              { internalType: "uint256", name: "supplyCaps", type: "uint256" },
              { internalType: "uint256", name: "borrowCaps", type: "uint256" },
              {
                internalType: "uint256",
                name: "totalBorrows",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "totalReserves",
                type: "uint256",
              },
              { internalType: "uint256", name: "totalSupply", type: "uint256" },
              { internalType: "uint256", name: "totalCash", type: "uint256" },
              { internalType: "bool", name: "isListed", type: "bool" },
              {
                internalType: "uint256",
                name: "collateralFactorMantissa",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "underlyingAssetAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "vTokenDecimals",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "underlyingDecimals",
                type: "uint256",
              },
            ],
            internalType: "struct PoolLens.VTokenMetadata[]",
            name: "vTokens",
            type: "tuple[]",
          },
        ],
        internalType: "struct PoolLens.PoolData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

];
