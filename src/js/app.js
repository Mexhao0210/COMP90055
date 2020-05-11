var ProductInstance;
var SupplyChainInstance;
var userAccount;
var abi=[{"inputs":[{"internalType":"bytes32","name":"_name","type":"bytes32"},{"internalType":"bytes32","name":"_description","type":"bytes32"},{"internalType":"bytes32","name":"_UUID","type":"bytes32"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"bytes32","name":"_name","type":"bytes32"},{"internalType":"bytes32","name":"_time","type":"bytes32"},{"internalType":"bytes32","name":"_description","type":"bytes32"}],"name":"addBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}];
App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        App.web3Provider = new Web3.prviders.HttpProvider("http://127.0.0.1:7545");
      }
      web3 = new Web3(App.web3Provider);
      // const accounts = await web3.eth.getAccounts();
      userAccount = web3.eth.defaultAccount;
      console.log("account= "+userAccount);
      return App.initContract();
    },

  
    initContract: function() {
      // var MyContract = web3.eth.contract(abi);
      //   const myContractInstance = await MyContract.at('0xE712E1DB0818bC60b4615936528A913D141B9faF');
      //   myContractInstance.getUUID().then(function(result){
      //   console.log(result);
      //   }).catch(function(err){
      //     console.log(err);
      //   });
      //get contract bin file from build/contracts
      $.getJSON('Product.json', function(data) {
        var ContractArtifacts = data;
        //get the contract object
        ProductInstance = TruffleContract(ContractArtifacts);
        ProductInstance.setProvider(App.web3Provider);
        //获取实例
        // ProductInstance = App.contracts.Product.deployed();

      });
      // $.getJSON('supplyBlock.json', function(data){
      //   App.contracts.supplyBlock = TruffleContract(data);
      //   App.contracts.supplyBlock.setProvider(App.web3Provider);
      //   SupplyChainInstance = App.contracts.supplyBlock.deployed();
      // });
      return App.bindViewEvents();
    },
  
    bindViewEvents: function() {
      // $(document).on('click', '.btn-view', App.handleAdopt);
      $('createbtn').click();
      $('#loginbt').click(function() {
        $(".mask").show();
        $(".bomb_box").show();
      });
    },

    viewProduct: function(){
      //week10
    },

    handleLogin: function() {
      var username = $("input[name='username']").text();
      var password = $("input[name='password']").text();
      $.ajax({
        type : 'get',
                    url : 'http://localhost:8080/login?username=xx&password=123',
                    dataType : 'json',
                    // data : {
                    //     "modelId" : id,
                    // },
                    success : function(data) {
                      alert("login!");
                    },
                    error : function(){
                      
                    }
               })
    }

  };

  function ProductSearching(event){   
    var searchval = $("#searchingItem").val();
    $("#productDisplay").empty();
    //alert(searchval);
    var data = getProductDetails(searchval).then(displayDetails); 
    $.getJSON( data, function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        items.push( "<li id='" + key + "'>" + val + "</li>" );
      });
      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "body" );
    });
   }

  function getProductDetails(product_id){
    return ProductInstance.methods.getProductDetails(product_id).call();
  }

  function ProductCreate(){
    var name = $("#name").val();
    var description = $("#description").val();
    //alert(name);
    if(name==="" || description==="") {
      alert("Empty parameters!");
      return
    }
    var productJson={"name":name,"description":description};
    var product_id=uuid.v1();    
    // var str_id = web3.toHex(product_id);
    // var str = web3.toHex(md5(productJson));
        console.log(md5(product_id));

    var str_id=ethers.utils.formatBytes32String(md5(product_id));
    var str=ethers.utils.formatBytes32String(md5(productJson));
    console.log(str);
    // ProductInstance.deployed()
    //新建一个contract with 一些参数
    // ProductInstance.new(str,str,str_id)
    // .then(function(instance){
    //   return instance.getUUID()}).then(function(result){
    //     console.log(result);
    //   }).catch(function(error){
    //     console.log(error.msg);
    //   })
    // }
      // $.ajax({
      //   type: "POST",//方法类型
      //   dataType: "json",//预期服务器返回的数据类型
      //   url: "http://34.66.139.55:8080/addprod" , //url
      //   data: {
      //     id:product_id,
      //     name:name,
      //     description:description
      //   },
      //    // data: JSON.stringify(data),
      //   // processData: false,
      //   // contentType: "application/json; charset=UTF-8",
      //   success: function (result) {
      //     console.log(result);//打印服务端返回的数据(调试用)
      //     if (result.data) {
      //         alert("Create successfully in DB");
      //     } else{
      //       alert("Create failed in DB");
      //     };
      //   },
      //   error : function() {
      //     alert("异常！");
      //   }
      // })
      // alert("create successfully~");
    //create Product 传入mongodb
  }
  
  function ProductToOwner(owner){
    //product belongs to which user->address
    return ProductInstance.methods.ProductToOwner(owner).call();
  }
  
  function getProductByOwner(owner){
    return ProductInstance.methods.getProductByOwner(owner).call();
  }

  function displayDetails(details){
      //show details of searching products
      $("#productsRow").empty();

      console.log("current product details: "+JSON.stringify(result));

      //显示一个product details
  }

  function displayProducts(product_ids){
    $("#productsRow").empty();
    var productsRow = $("#productsRows");
    var productDisplay = $("#productDisplay");
    for(id of product_ids){
      getProductDetails(id).then(function(product){
        //product包含的信息，假定显示name&description
        productDisplay.find('.panel-title').text(product.name);
        // productDisplay.find('img').attr('src',product.picture); 
        productDisplay.find('product-des').text(product.discription);
        productDisplay.find('btn-view').attr('product_id',id);
        productsRow.append(productDisplay.html());
      });
    }
  }

  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  
  function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    if(username==="" || password==="") {
      alert("Enter valid username/password");
      return
    }
    $.ajax({
    //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "http://34.66.139.55:8080/login" ,//url
        data: {
          username:username,
          password:password
        },
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            if (result.data) {
                alert("SUCCESS");
            } else{
              alert("FAIL");
            }
            ;
        },
        error : function() {
            alert("异常！");
        }
    });
  }
  