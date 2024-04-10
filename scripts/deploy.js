const hre = require("hardhat");

async function main() {
  const initBalance = 1;
  const Assessment = await hre.ethers.getContractFactory("MyContract");
  const assessment = await Assessment.deploy(initBalance);
  await assessment.deployed();

  console.log(
    `A contract with a balance of ${initBalance} ETH deployed to ${assessment.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
