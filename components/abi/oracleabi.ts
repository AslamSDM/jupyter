export const oracleabi = [
  {
    inputs: [
      { internalType: "address", name: "vBnbAddress", type: "address" },
      { internalType: "address", name: "vaiAddress", type: "address" },
      {
        internalType: "contract BoundValidatorInterface",
        name: "_boundValidator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "calledContract", type: "address" },
      { internalType: "string", name: "methodSignature", type: "string" },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldAccessControlManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAccessControlManager",
        type: "address",
      },
    ],
    name: "NewAccessControlManager",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      { indexed: true, internalType: "uint256", name: "role", type: "uint256" },
      { indexed: true, internalType: "bool", name: "enable", type: "bool" },
    ],
    name: "OracleEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      { indexed: true, internalType: "uint256", name: "role", type: "uint256" },
    ],
    name: "OracleSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "mainOracle",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pivotOracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "fallbackOracle",
        type: "address",
      },
    ],
    name: "TokenConfigAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "BNB_ADDR",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INVALID_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "accessControlManager",
    outputs: [
      {
        internalType: "contract IAccessControlManagerV8",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "boundValidator",
    outputs: [
      {
        internalType: "contract BoundValidatorInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      {
        internalType: "enum ResilientOracle.OracleRole",
        name: "role",
        type: "uint8",
      },
      { internalType: "bool", name: "enable", type: "bool" },
    ],
    name: "enableOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      {
        internalType: "enum ResilientOracle.OracleRole",
        name: "role",
        type: "uint8",
      },
    ],
    name: "getOracle",
    outputs: [
      { internalType: "address", name: "oracle", type: "address" },
      { internalType: "bool", name: "enabled", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getTokenConfig",
    outputs: [
      {
        components: [
          { internalType: "address", name: "asset", type: "address" },
          { internalType: "address[3]", name: "oracles", type: "address[3]" },
          {
            internalType: "bool[3]",
            name: "enableFlagsForOracles",
            type: "bool[3]",
          },
        ],
        internalType: "struct ResilientOracle.TokenConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "vToken", type: "address" }],
    name: "getUnderlyingPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "accessControlManager_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "accessControlManager_",
        type: "address",
      },
    ],
    name: "setAccessControlManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "oracle", type: "address" },
      {
        internalType: "enum ResilientOracle.OracleRole",
        name: "role",
        type: "uint8",
      },
    ],
    name: "setOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "asset", type: "address" },
          { internalType: "address[3]", name: "oracles", type: "address[3]" },
          {
            internalType: "bool[3]",
            name: "enableFlagsForOracles",
            type: "bool[3]",
          },
        ],
        internalType: "struct ResilientOracle.TokenConfig",
        name: "tokenConfig",
        type: "tuple",
      },
    ],
    name: "setTokenConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "asset", type: "address" },
          { internalType: "address[3]", name: "oracles", type: "address[3]" },
          {
            internalType: "bool[3]",
            name: "enableFlagsForOracles",
            type: "bool[3]",
          },
        ],
        internalType: "struct ResilientOracle.TokenConfig[]",
        name: "tokenConfigs_",
        type: "tuple[]",
      },
    ],
    name: "setTokenConfigs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "updateAssetPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "vToken", type: "address" }],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vBnb",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vai",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
