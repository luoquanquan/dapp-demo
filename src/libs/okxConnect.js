import OKXConnectSDK, { openConnectModal } from "@repo/dapp-connect-sdk";

let sdk;

const init = async () => {
  sdk = await OKXConnectSDK.init();
  console.log("sdk: ", sdk);
};

init();

export { sdk, openConnectModal };
