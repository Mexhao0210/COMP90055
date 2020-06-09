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
      // $('createbtn').click();
      $('#loginbt').click(function() {
        $(".mask").show();
        $(".bomb_box").show();
      });

      var role = getCookie("role");
      if(role!== ""){
        var user = getCookie("username");
        $('#li1').html('<a onclick = "logout()"> Hello, '+user+'</a>');
        if(role == "admin"){
          $('#li2').html('<a href="index.html" name="Search">Home</a>');
          $('#li3').html('<a href="create.html" name="Create">Create</a>');
          $('#li4').html('<a href="add.html" name="Update">Update</a>');
        } else {
          $('#li2').html('<a href="index.html" name="Search">Search</a>');
          $('#li3').html('<a href="#product" name="Products">Products</a>');
          getUserProducts(role);
        }
      }
      // alert(role);
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

  function testList(data){
    $("#product").empty();
    $("#instruction").empty();
    $("#instruction").append("Your product information");
    var list_body = $("#list_body");
    $("#prodRow").empty();
    var prodRow = $("#prodRow");
    var prodBody = "";
    if(data.length < 1 ){
      data = [{"id":"100","id2":"123","name":"swoosh t-shirt","price":"99.00","trackID":"1010304892"},{"id":"100","id2":"123","name":"nintendo switch","price":"469.00","style":"Grey-2019"},{"id":"100","id2":"123","name":"Nike AirForce1","price":"299.00","color":"white","location":"Melbourne"}];
    }
    for (j = 0; j < data.length; j ++) {
      //for each product 
      var result = data[j];
      var keys = Object.keys(result);
      list_body.empty();
      for (i = 2, len = keys.length; i < len; i++) { 
        var k = keys[i];
        prodBody = '<strong class="emboss">'+k+'</strong>: <span class="search-info">'+result[k]+'</span><br/>';
        list_body.append(prodBody);
      }
      prodRow.append('<div class="col-sm-4">'+list_body.html()+'</div>');
    }
    $("#list_body").empty();
  }

  function getUserProducts(role){
    console.log(role);
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "http://34.66.139.55:8080/getprodByOwner" ,//url
      data: {owner:role},
      success: function (data) {      
        //return json string
        console.log(data);
        testList(data);
      },
      error : function() {
          console.error("No products for this user.")
      }
    });
  }


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
                  var currentRows = document.getElementById("panel-body").rows.length; 
                  var insertTr = document.getElementById("panel-body").insertRow(currentRows);
                  var insertTd = insertTr.insertCell(0);
                  insertTd.style.textAlign="center";
                  insertTd.style.border="solid 1px #add9c0";
                  insertTd.innerHTML = '<strong class="emboss">'+k+'</strong>';
                  insertTd = insertTr.insertCell(1);
                  insertTd.style.textAlign="center";
                  insertTd.style.border="solid 1px #add9c0";
                  insertTd.innerHTML = '<span class="search-info">'+result[k]+'</span><br/>';
              }
              var currentRows = document.getElementById("panel-body").rows.length; 
              var insertTr = document.getElementById("panel-body").insertRow(currentRows);
              var insertTd = insertTr.insertCell(0);
              insertTd.style.textAlign="center";
              insertTd.style.border="solid 1px #add9c0";
              insertTd.innerHTML = '<strong class="emboss">ORcode</strong>';
              insertTd = insertTr.insertCell(1);
              insertTd.style.textAlign="center";
              insertTd.style.border="solid 1px #add9c0";
              insertTd.innerHTML = '<div id="qrcode" style="width:100px; height:100px; margin:auto;"></div>';
              var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 100,
                height : 100
              });
              qrcode.makeCode("http://34.66.139.55:8080/getprod?id="+searchval);
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
   var user = getCookie("username");
   field = "From " + user + " " + field;
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
              location="add.html"
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
                    alert("First update successfully!");
                    location="create.html";
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
                // alert("SUCCESS");
                // $('#loginTable').empty();
                // var info = '<div class="info-title">You can create or update your product now.</div>';
                // $('#loginTable').append(info);
                setCookie("role", result.data.role,600);
                setCookie("username", result.data.username,600);
                location="index.html"
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

  function logout(){
    setCookie("role","",1);
    setCookie("username","",1);
    $('#li1').html('<a href="login.html" name="Login">Login</a>');
    location="index.html";
  }

  function setCookie(name, value, seconds) {
    seconds = seconds || 0;   //seconds有值就直接赋值，没有为0
    var expires = "";
    if (seconds != 0) {      //设置cookie生存时间
        var date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值
  }

  function getCookie(name) {
    var tep = document.cookie;
    var cks = tep.split("; ");
    for (var i=0;i<cks.length;i++){
      if(cks[i].includes(name)){
        var item = cks[i].split("=")
        return item[1];
      }
    }
    return "";
  }


