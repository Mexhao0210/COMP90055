var ProductArtifact;
const App = {
    web3: null,
    account: null,
    contract: null,
  
    start: async function() {
      const { web3 } = this;
  
      try {
        // get contract instance
        $.getJSON('Product.json',function(data){
            ProductArtifact=TruffleContract(data);
        });
        var address = '0x2849A694774eaDb8d3F87ffbc8868f6b9e2ad5Ff';
        // var MyContract = web3.eth.Contract(ProductArtifact);
        // this.contract = ProductArtifact.at(address);
        // get accounts
        const accounts = await web3.eth.getAccounts();
        this.account = accounts[0];
        console.log("account= "+accounts[0]);

        // this.refreshBalance();
      } catch (error) {
        console.error("Could not connect to contract or chain.");
        console.log(error);
      }
    },

    sendCoin: async function() {
        const name = parseInt(document.getElementById("amount").value);
        const des = document.getElementById("receiver").value;
        var id=uuid.v1();
        this.setStatus("Initiating transaction... (please wait)");
    
        const { constructor } = this.contract.methods;
        await constructor(name, des, id).send({ from: this.account });

        this.setStatus("Transaction complete!");
      },
  
    // ProductCreate: async function() {
    //   const name = parseInt(document.getElementById("name").value);
    //   const des = document.getElementById("description").value;
    //   var id=uuid.v1();
    //   this.setStatus("Initiating transaction... (please wait)");
  
    //   const { constructor } = this.contract.methods;
    //   await constructor(name, des, id).send({ from: this.account });
  
    //   this.setStatus("Transaction complete!");
    // },
  
    setStatus: function(message) {
      const status = document.getElementById("status");
      status.innerHTML = message;
    },
  };
  
  window.App = App;
  
  window.addEventListener("load", function() {
    if (window.ethereum) {
      // use MetaMask's provider
      App.web3 = new Web3(window.ethereum);
      window.ethereum.enable(); // get permission to access accounts
    } else {
      console.warn(
        "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      App.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
      );
    }
  
    App.start();
  });