import OKXConnectSDK, {
  openConnectModal,
  hackOKXConnectUI,
} from "@repo/dapp-connect-sdk";

let sdk;

const init = async () => {
  sdk = await OKXConnectSDK.init();
  console.log("sdk: ", sdk);
  hackOKXConnectUI();
};

init();

export { sdk, openConnectModal };
