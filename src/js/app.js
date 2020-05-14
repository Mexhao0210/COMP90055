var ProductInstance;
var userAccount;
App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      }
      web3 = new Web3(App.web3Provider);
      // const accounts = await web3.eth.getAccounts();
      userAccount = web3.eth.defaultAccount;
      console.log("account= "+userAccount);
      return App.initContract();
    },

  
    initContract: function() {
      //get contract bin file from build/contracts
      $.getJSON('Main.json', function(data) {
        var ContractArtifacts = data;
        //get the contract object
        ProductInstance = TruffleContract(ContractArtifacts);
        ProductInstance.setProvider(App.web3Provider);

      });
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

  function ProductSearching(){   
    var searchval = $("#searchingItem").val();
    if(searchval==="" ) {
      alert("Enter valid product id!");
      return
    }
    $.ajax({
          type: "GET",
          dataType: "json",
          url: "http://34.66.139.55:8080/getprod" ,//url
          data: {id:searchval},
          success: function (result) {      
              if(result){
                $("#productDisplay").empty();
                //window.location.href="search.html"; 
                var productDetails = $("#productDetails");
                productDetails.find('.product-name').text(result.name);
                console.log(result.name);
                productDetails.find('.product-des').text(result.description);
              }
              else{
                alert("FAIL");
              };
          },
          error : function() {
              alert("异常！");
          }
      });
    }
   
   

  function ProductCreate(){
    var name = $("#name").val();
    var description = $("#description").val();
    //alert(name);
    if(name==="" || description==="") {
      alert("Empty parameters!");
      return
    }
    var product_id=uuid.v1();
    var id_bytes=web3.toHex(product_id);
    console.log(web3.toHex(product_id));
    console.log("des:"+ web3.toHex(description));
    var prod={id:product_id,name:name,description:description};

    ProductInstance.deployed().then(function(instance){
      return instance.createProduct(id_bytes)}).then(function(result){
        console.log(result);
      }).catch(function(error){
        console.log(error.msg);
      });
    console.log(JSON.stringify(prod));
      $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        contentType:"application/json",
        url: "http://34.66.139.55:8080/addprod" , //url
        data: JSON.stringify(prod),
        success: function (result) {
          console.log(result);//打印服务端返回的数据(调试用)
          if (result.status==0) {
            console.log("status: "+result.status);
              alert("Create successfully in DB");
          } else{
            alert("Create failed in DB");
          };
        },
        error : function() {
          alert("异常！");
        }
      })
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
