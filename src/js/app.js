// import Web3 from "web3";
// var Web3 = require('web3');
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
            console.error("No such id in DB")
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
                $("#product_load").empty();
                var loaded = '<h4>Product information.</h4>';
                $("#product_load").append(loaded);
                $("#panel-body").empty();
                var body = "";
                for (i = 2, len = keys.length; i < len; i++) { 
                  var k = keys[i];
                  console.log(result[k]);
                  body = '<strong class="emboss">'+k+'</strong>: <span class="search-info">'+result[k]+'</span><br/>';
                  $("#panel-body").append(body);
              }
    })
     }

  async function UpdateChecking(pid){
    return new Promise(function(resolve,reject){
      ProductInstance.deployed().then(function(instance){
        return instance.getLastBlock(pid);
      }).then(function(receipt){
        console.log("from sol: "+String(receipt));
        getProduct(pid).then(result=>{
          console.log("fromDB: "+JSON.stringify(result));
          console.log("fromDB after md5: "+md5(JSON.stringify(result)))
          if(String(receipt) == md5(JSON.stringify(result))){
            resolve(true)
          }
          else{resolve(false)}
        }).catch(function(err){
          console.log(err)
        })
    })
  })
}
   
  async function ProductUpdate(){
   var pid = $("#pid").val();
   var field = document.getElementById("field").value;
   var information = document.getElementById("information").value;
   console.log(field);
   console.log(information);
   if(pid===""||field===""||information===""){
     alert("Empty parameters!");
     return
   }
  //  update_ = {"id":pid,"key":field,"val":information};
  //  updateJson = JSON.stringify(update_);
  //  console.log(updateJson);

   //Integrity checking before updating
   const result = await UpdateChecking(pid);
   if(result){
     console.log("成功")
     $.ajax({
      type: "POST",//方法类型
      dataType: "json",//预期服务器返回的数据类型
      //contentType:"application/json",
      url: "http://34.66.139.55:8080/updateprod" , //url
      data: {id:pid,key:field,val:information},
      success: function (result) {
        console.log(result);//打印服务端返回的数据(调试用)
        if (result.status===0) {
          console.log("Successful update, status: "+result.status);
          getProduct(pid).then(result=>{
            console.log(result);
            ProductInstance.deployed().then(function(instance){
              return instance.updateChain(pid,md5(JSON.stringify(result)));
            }).then(function(result){
              console.log(result);
              alert("Update successfully!")
            }).catch(function(error){
              console.log(error.msg);
            })
          })
        } else{
          alert("Update failed in DB")};
      },
      error : function() {
        alert("异常！");
      }
    })
   }else{
     console.log("失败")
   }

  }

  function ProductCreate(){
    var name = $("#name").val();
    var price = $("#description").val();
    //alert(name);
    if(name==="" || description==="") {
      alert("Empty parameters!");
      return
    }
    var product_id=uuid.v1();
    $.ajax({
      type: "POST",//方法类型
      dataType: "json",//预期服务器返回的数据类型
      contentType:"application/json;charset=utf-8",
      url: "http://34.66.139.55:8080/addprod" , //url
      data: JSON.stringify({
        data:{id:product_id, name:name, price:parseFloat(price)}}),
      success: function (result) {
        console.log(result);//打印服务端返回的数据(调试用)
        if (result.status==0) {
          console.log("Successful in DB");
          ProductInstance.deployed().then(function(instance){
            return instance.createProduct(product_id)}).then(function(result){
              console.log(result);
              if(result){
                alert("Create successfully");
                getProduct(product_id).then(result=>{
                  // console.log(result);
                  ProductInstance.deployed().then(function(instance){
                    return instance.updateChain(product_id,md5(JSON.stringify(result)));
                  }).then(function(result){
                    console.log(result);
                    alert("First update successfully!")
                  }).catch(function(error){
                    console.log(error.msg);
                  })
                });
              } else{
                console.log("Fail in DB")
              };  
            }).catch(function(error){ //create 
              console.log(error.msg);
            });  
          }
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
    $('#loginTable').empty();
                var info = '<div class="info-title">You can create or update your product now.</div>';
                $('#loginTable').append(info);
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
                $('#loginTable').empty();
                var info = '<div class="info-title">You can create or update your product now.</div>';
                $('#loginTable').append(info);
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



