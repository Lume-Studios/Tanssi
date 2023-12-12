import { ethers } from "hardhat";

async function main() {
  const entry_point_address = "0xAa588d3737B611baFD7bD713445b314BD453a5C8"
  const deployer = (await ethers.getSigners())[0]

  const Beacon = await ethers.getContractFactory("UpgradeableBeacon")
  const UUPS = await ethers.getContractFactory("ERC1967Proxy")

  const AccountFactory = await UUPS.getContractFactory("AccountFactory")
  const WalletAccountFGE = await UUPS.getContractFactory("WalletAccountForGasEstimation")
  const WalletAccount = await UUPS.getContractFactory("WalletAccount")
  const UserOpValidator = await UUPS.getContractFactory("UserOpValidator")
  const Management = await UUPS.getContractFactory("Management")

  const accountFactory = await AccountFactory.deploy()
  await accountFactory.deployed()
  const walletAccountFGE = await WalletAccountFGE.deploy()
  await walletAccountFGE.deployed()
  const userOpValidator = await UserOpValidator.deploy()
  await userOpValidator.deployed()
  const management = await Management.deploy()
  await management.deployed()
  const walletAccount = await WalletAccount.deploy(entry_point_address, accountFactory.address, management.address)
  await walletAccount.deployed()

  const walletAccountFactoryProxy = await Beacon.deploy(management.address)
  await walletAccountFactoryProxy.deployed()

  let abi = ["function initialize(address,address)"]
  let function_name = "initialize"
  let iface = new ethers.utils.Interface(abi)
  let data = iface.encodeFunctionData(function_name, [walletAccountFactoryProxy.address, deployer.address])
  const accountFactoryProxy = await UUPS.deploy(accountFactory.address, data)
  await accountFactoryProxy.deployed()

  abi = ["function initialize(address)"]
  function_name = "initialize"
  iface = new ethers.utils.Interface(abi)
  data = iface.encodeFunctionData(function_name, [deployer.address])
  const managementFactoryProxy = await UUPS.deploy(management.address, data)
  await managementFactoryProxy.deployed()

  console.log("Implementations:")
  console.log("\tAccountFactory:", accountFactory.address)
  console.log("\tWalletAccountForGasEstimation:", walletAccountFGE.address)
  console.log("\tWalletAccount:", walletAccount.address)
  console.log("\tUserOpValidator:", userOpValidator.address)
  console.log("\tManagement:", management.address, "\n")

  console.log("\nProxies:")
  console.log("\tAccountFactory:", accountFactoryProxy.address)
  console.log("\tWalletAccount:", walletAccountFactoryProxy.address)
  console.log("\tManagement:", managementFactoryProxy.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
