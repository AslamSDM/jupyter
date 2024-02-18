export default function getImage(name: string) {
  const coinImages = [
    {
      name: "Venus BTC",
      link: "https://app.venus.io/assets/btcb-88ed0fde.svg",
    },
    { name: "Venus BNB", link: "https://app.venus.io/assets/bnb-8cd7030f.svg" },
    {
      name: "Venus USDD",
      link: "https://app.venus.io/assets/usdd-2f108c20.svg",
    },
    {
      name: "Venus ankrBNB",
      link: "https://app.venus.io/assets/bnb-8cd7030f.svg",
    },
    {
      name: "Venus USDT",
      link: "https://app.venus.io/assets/usdt-68774da1.svg",
    },
    {
      name: "Venus WBETH",
      link: "https://app.venus.io/assets/wbeth-4eecb0a4.svg",
    },
    { name: "Venus ETH", link: "https://app.venus.io/assets/eth-ffd84278.svg" },
    {
      name: "Venus CAKE",
      link: "https://app.venus.io/assets/cake-c9e02a24.svg",
    },
    { name: "Venus BSW", link: "	https://app.venus.io/assets/bsw-378a0dd1.svg" },
    {
      name: "Venus ALPACA",
      link: "https://app.venus.io/assets/alpaca-3d1836fb.png",
    },
    {
      name: "Venus ANKR",
      link: "	https://app.venus.io/assets/ankr-d8ff80fc.svg",
    },
    {
      name: "Venus agEUR",
      link: "	https://app.venus.io/assets/agEUR-923b87e8.svg",
    },
    {
      name: "Venus RACA",
      link: "https://app.venus.io/assets/raca-e6ba6596.png",
    },
    {
      name: "Venus BNBx",
      link: "https://app.venus.io/assets/bnbx-a02cf002.png",
    },
    { name: "Venus BTT", link: "https://app.venus.io/assets/btt-5c3484d7.svg" },
    { name: "Venus WIN", link: "https://app.venus.io/assets/win-3f169c62.svg" },
    {
      name: "Venus HAY",
      link: "	https://app.venus.io/assets/lisUSD-50a8bbe1.png",
    },
    {
      name: "Venus SnBNB",
      link: "https://app.venus.io/assets/slisBNB-96761da9.png",
    },
    {
      name: "Venus WBNB",
      link: "https://app.venus.io/assets/wbnb-e73b2dde.svg",
    },
    {
      name: "Venus stkBNB",
      link: "https://app.venus.io/assets/stkBNB-14b66c9a.svg",
    },
    {
      name: "Venus PLANET",
      link: "https://app.venus.io/assets/planet-0a528d79.svg",
    },
    {
      name: "Venus FLOKI",
      link: "https://app.venus.io/assets/floki-1bb0894a.svg",
    },
    { name: "Venus TWT", link: "https://app.venus.io/assets/twt-5a3293b4.svg" },
    { name: "vXVS", link: "https://app.venus.io/assets/xvs-e7b82352.svg" },
    { name: "Venus XVS", link: "https://app.venus.io/assets/xvs-e7b82352.svg" },
    {
      name: "Venus USDC",
      link: "https://app.venus.io/assets/usdc-ae6ed32b.svg",
    },
    { name: "Venus ADA", link: "https://app.venus.io/assets/ada-9d7a6f24.svg" },
    {
      name: "Venus FDUSD",
      link: "https://app.venus.io/assets/fdusd-62dad3b2.svg",
    },
    { name: "Venus XRP", link: "https://app.venus.io/assets/xrp-9be79045.svg" },
    {
      name: "Venus LINK",
      link: "https://app.venus.io/assets/link-32c47670.svg",
    },
    { name: "Venus LTC", link: "https://app.venus.io/assets/ltc-6e389742.svg" },
    {
      name: "Venus MATIC",
      link: "https://app.venus.io/assets/matic-c60ba133.svg",
    },
    { name: "Venus DOT", link: "https://app.venus.io/assets/dot-03d2d462.svg" },
    {
      name: "Venus DOGE",
      link: "https://app.venus.io/assets/doge-dc29fc2f.svg",
    },
    { name: "Venus SXP", link: "https://app.venus.io/assets/sxp-2fad29e2.svg" },
    {
      name: "Venus FIL",
      link: "https://app.venus.io/assets/fil-0a1b2be4.svg",
    },
    {
      name: "Venus BUSD",
      link: "https://app.venus.io/assets/busd-baa54711.svg",
    },
    { name: "Venus BCH", link: "https://app.venus.io/assets/bch-0f0ae5e9.svg" },
    {
      name: "Venus BETH",
      link: "https://app.venus.io/assets/beth-a937adc5.svg",
    },
    { name: "Venus UNI", link: "https://app.venus.io/assets/uni-2a3192f0.svg" },
    {
      name: "Venus AAVE",
      link: "https://app.venus.io/assets/aave-f2ee2949.svg",
    },
    { name: "Venus DAI", link: "https://app.venus.io/assets/dai-0065b21e.svg" },
    { name: "Venus TRX", link: "https://app.venus.io/assets/trx-025f5595.svg" },
    {
      name: "Venus TUSD",
      link: "https://app.venus.io/assets/tusd-e00ef2f1.svg",
    },
    {
      name: "Venus LUNA",
      link: "https://app.venus.io/assets/luna-d3c46131.svg",
    },
    {
      name: "Venus TUSDOLD",
      link: "https://app.venus.io/assets/trx-025f5595.svg",
    },
    {
      name: "Venus TRXOLD",
      link: "https://app.venus.io/assets/usdt-68774da1.svg",
    },
    { name: "Venus UST", link: "https://app.venus.io/assets/ust-9718b760.svg" },
  ];

  const image = coinImages.find((coin) => coin.name === name);
  if (image) {
    return image.link;
  }
  return "";
}
