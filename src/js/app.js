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

  //return a promise object
  function getProduct(param){
    return new Promise(function(resolve, reject){
      $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://34.66.139.55:8080/getprod" ,//url
        data: {id:param},
        success: function (data) {      
          resolve(data);
        },
        error : function() {
            alert("异常！");
        }
      });
    })
  }

  function ProductSearching(){   
    var searchval = $("#searchingItem").val();
    if(searchval==="" ) {
      alert("Enter valid product id!");
      return
    }
    getProduct(searchval).then(result=>{
      var keys = Object.keys(result);// from keys[2
                console.log(keys);
                $("#productDisplay").empty();
                //window.location.href="search.html"; 
                $("#panel-body").empty();
                var body = "";
                for (i = 2, len = keys.length; i < len; i++) { 
                  var k = keys[i];
                  console.log(result[k]);
                  body = '<strong>'+k+'</strong>: <span class="product-info">'+result[k]+'</span><br/>';
                  $("#panel-body").append(body);
              }
    })
    // $.ajax({
    //       type: "GET",
    //       dataType: "json",
    //       url: "http://34.66.139.55:8080/getprod" ,//url
    //       data: {id:searchval},
    //       success: function (result) {      
    //           if(result){
    //               $("#productDisplay").empty();
    // //window.location.href="search.html"; 
    // var keys = Object.keys(result);// from keys[2]
    // console.log(keys);
    // var productDetails = $("#productDetails");
    // productDetails.find('.product-name').text(result.name);
    // console.log(result.name);
    // productDetails.find('.product-des').text(result.description);
    //           }
    //           else{
    //             alert("FAIL");
    //           };
    //       },
    //       error : function() {
    //           alert("异常！");
    //       }
    //   });

   }

   //待测试
  function UpdateChecking(pid){
    var flag = false;
    ProductInstance.deployed().then(function(instance){
      instance.getLastBlock(web3.toHex(pid));
    }).then(function(receipt){
      console.log("from sol: "+JSON.stringify(receipt));
      getProduct(pid).then(result=>{
        console.log("fromDB: "+JSON.stringify(result));
        if(web3.toHex(md5(JSON.stringify(result))) === md5(JSON.stringify(receipt))){
          flag = true;
        }
      })
    }).catch(function(error){
          console.log(error.msg);
    })
    console.log(flag);
    return flag;
  }
    //get solidity中最后一块数据和mongo中做对比

  //   ProductInstance.deployed().then(function(instance){
  //     return instance.getLastBlock(web3.toHex(pid));
  //   }).then(function(receipt){
  //     console.log(JSON.stringify(receipt));
  //     $.ajax({
  //       type: "GET",
  //       dataType: "json",
  //       url: "http://34.66.139.55:8080/getprod" ,
  //       data: {id:pid},
  //       success: function (result) {      
  //           if(result){
  //             return (JSON.stringify(receipt) === JSON.stringify(result))
  //           }
  //           else{
  //             alert("Get product: FAIL");
  //             return
  //           }
  //       },
  //       error : function() {
  //           alert("异常！");
  //       }
  //     });
  //   }).catch(function(error){
  //     console.log(error.msg);
  //   })
  //  }

   
   //待测试
 function ProductUpdate(){
   var pid = $("#pid").val();
   var field = document.getElementById("field").value;
   var information = document.getElementById("information").value;
   console.log(field);
   console.log(information);
   if(pid===""||field===""||information===""){
     alert("Empty parameters!");
     return
   }
   update_ = {"id":pid,"key":field,"value":information};
   updateJson = JSON.stringify(update_);
   console.log(updateJson);
  //  var flag = UpdateChecking(pid);
  //  if(flag){
  //    console.log("Integrity checking successfully!");
  //  }else{
  //    console.log("是谁修改了数据？");
  //  }
   //MongoDB
   $.ajax({
    type: "POST",//方法类型
    dataType: "json",//预期服务器返回的数据类型
    contentType:"application/json",
    url: "http://34.66.139.55:8080/updateprod" , //url
    data: updateJson,
    success: function (result) {
      console.log(result);//打印服务端返回的数据(调试用)
      if (result.status===0) {
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
   //Solidity
  //  var info_;
  //  var info_json=JSON.stringify(info_);
  //  console.log("info_json: "+info_json);
  //  console.log("info_sol: "+web3.toHex(md5(info_json)));
  //  ProductInstance.deployed().then(function(instance){
  //    return instance.updateChain(web3.toHex(pid),web3.toHex(md5(info_json)));
  //  }).then(function(result){
  //    console.log(result);
  //  }).catch(function(error){
  //    console.log(error.msg);
  //  })

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
    // ProductInstance.deployed().then(function(instance){
    //   return instance.createProduct(id_bytes)}).then(function(result){
    //     console.log(result);
    //   }).catch(function(error){
    //     console.log(error.msg);
    //   });
    productJson = JSON.stringify({"id":product_id,"name":name,"description":description})
    console.log(productJson);
      $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        contentType:"application/json",
        url: "http://34.66.139.55:8080/addprod" , //url
        data: productJson,
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

