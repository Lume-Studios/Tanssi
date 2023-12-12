const { ethers } = require("ethers");
const hre = require("hardhat");
const { FormatTypes, Interface } = require("@ethersproject/abi");

async function main() {
  const entry_point_address = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" //0xAa588d3737B611baFD7bD713445b314BD453a5C8
const deployer = (await hre.ethers.getSigners())[0]
console.log(ethers.utils)

//const deployer = await  ethers.provider.getSigner()

  // const Beacon = await hre.ethers.getContractFactory("UpgradeableBeacon")
  // const UUPS = await hre.ethers.getContractFactory("ERC1967Proxy")

  // const AccountFactory = await hre.ethers.getContractFactory("AccountFactory")
  // const WalletAccountFGE = await hre.ethers.getContractFactory("WalletAccountForGasEstimation")
  // const WalletAccount = await hre.ethers.getContractFactory("WalletAccount")
  // const UserOpValidator = await hre.ethers.getContractFactory("UserOpValidator")
  // const Management = await hre.ethers.getContractFactory("Management")

  const accountFactory = await hre.ethers.deployContract("AccountFactory")
  await accountFactory.waitForDeployment()

  const walletAccountFGE = await hre.ethers.deployContract("WalletAccountForGasEstimation")
  await walletAccountFGE.waitForDeployment()

  const userOpValidator = await hre.ethers.deployContract("UserOpValidator")
  await userOpValidator.waitForDeployment()

  const management = await hre.ethers.deployContract("Management")
  await management.waitForDeployment()

  const walletAccount = await hre.ethers.deployContract("WalletAccount", [entry_point_address, accountFactory.getAddress(), management.getAddress()])
  await walletAccount.waitForDeployment()



  // const walletAccountFGE = await WalletAccountFGE.deploy()
  // await walletAccountFGE.deployed()
  // const userOpValidator = await UserOpValidator.deploy()
  // await userOpValidator.deployed()
  // const management = await Management.deploy()
  // await management.deployed()
  // const walletAccount = await WalletAccount.deploy(entry_point_address, accountFactory.address, management.address)
  // await walletAccount.deployed()

  const managementaddr = await management.getAddress();
  const accfactory = await accountFactory.getAddress();
  

  const walletAccountFactoryProxy = await hre.ethers.deployContract("UpgradeableBeacon",[managementaddr,deployer.address])
 await walletAccountFactoryProxy.waitForDeployment()
 
 const walletAccountFactoryPr = await walletAccountFactoryProxy.getAddress();

  let abi = ["function initialize(address,address)"]
  let function_name = "initialize"
  let iface = new Interface(abi) //hre.ethers.utils.
  let data = iface.encodeFunctionData(function_name, [walletAccountFactoryPr, "0xAaa7cCF1627aFDeddcDc2093f078C3F173C46cA4"]) //0x627306090abaB3A6e1400e9345bC60c78a8BEf57
  const accountFactoryProxy = await hre.ethers.deployContract("ERC1967Proxy",[accfactory,data])
  await accountFactoryProxy.waitForDeployment()

  abi = ["function initialize(address)"]
  function_name = "initialize"
  iface = new Interface(abi)
  data = iface.encodeFunctionData(function_name, ["0xAaa7cCF1627aFDeddcDc2093f078C3F173C46cA4"])
  const managementFactoryProxy =  await hre.ethers.deployContract("ERC1967Proxy",[managementaddr,data])
  await managementFactoryProxy.waitForDeployment()

 
  const walletAccountF = await walletAccountFGE.getAddress();
  const walletAccou = await walletAccount.getAddress();
  const userOpValida = await userOpValidator.getAddress();
  

  console.log("Implementations:")
  console.log("\tAccountFactory:", accfactory)
  console.log("\tWalletAccountForGasEstimation:", walletAccountF)
  console.log("\tWalletAccount:", walletAccou)
  console.log("\tUserOpValidator:", userOpValida)
  console.log("\tManagement:", managementaddr, "\n")

  const accountFactoryPro = await accountFactoryProxy.getAddress();
  const managementFactoryPro = await managementFactoryProxy.getAddress();

  console.log("\nProxies:")
  console.log("\tAccountFactory:",accountFactoryPro)
  console.log("\tWalletAccount:", walletAccountFactoryPr)
  console.log("\tManagement:", managementFactoryPro)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
