const exampleRequest = {
  network_id: "1",
  save: true,
  save_if_fails: true,
  simulation_type: "full",
  from: "0xe58b9ee93700a616b50509c8292977fa7a0f8ce1",
  to: "0x6b175474e89094c44da98b954eedeac495271d0f",
  input:
    "0x095ea7b3000000000000000000000000f7ddedc66b1d482e5c38e4730b3357d32411e5dd0000000000000000000000000000000000000000000000000de0b6b3a7640000",
};

interface SimulateTransactionRequest {
  network_id: string;
  save: boolean;
  save_if_fails: boolean;
  simulation_type: "full";
  from: string;
  to: string;
  input: string;
}

export const simulateTransaction = () => {};
