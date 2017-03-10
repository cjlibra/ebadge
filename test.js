var users = `[
    {name: 'a', age: 14, sex: 0},
    {name: 'b', age: 15, sex: 0},
    {name: 'c', age: 16, sex: 1}
]`
/*
aaa = JSON.stringify(users);
console.log(aaa)



var jsonstr = "{a:1}"
eval("(" + jsonstr + ")")*/

bb = eval("(" + users + ")")
//cc = JSON.parse(users)
//aaa = bb.toJSON() 
console.log(JSON.stringify(bb))
a1 = console.log(bb)
console.log(a1,typeof a1)

/*
var crypto = require('crypto');
var key = 'dzxh0010';
exports.des = {
 
  algorithm:{ ecb:'des-ecb',cbc:'des-cbc' },
  encrypt:function(plaintext,iv){
    var key = new Buffer(key);
    var iv = new Buffer(iv ? iv : 0);
    var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
    cipher.setAutoPadding(true) //default true
    var ciph = cipher.update(plaintext, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
  },
  decrypt:function(encrypt_text,iv){
    var key = new Buffer(key);
    var iv = new Buffer(iv ? iv : 0);
    var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
    decipher.setAutoPadding(true);
    var txt = decipher.update(encrypt_text, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt;
  }
 
};*/

//加密
//范例原文：EABBCDEF017F2E98
//范例密文：Bc00KvHKsZTDH1FUyImqFrP23MK3JfDb

var crypto = require('crypto');
//var cryptUtil = require("./crypt.js");
//var iv="Ahbool"
var str = "EABBCDEF017F2E98";
//var key = 'dzxh0010';
/*
var encrypt_text = cryptUtil.des.encrypt(str,0);
var decrypt_text = cryptUtil.des.decrypt(encrypt_text,0);
console.log(encrypt_text);
console.log(decrypt_text);
if (encrypt_text == "Bc00KvHKsZTDH1FUyImqFrP23MK3JfDb"){
	console.log("ok")
}*/
var Buffer = require('buffer').Buffer;
var a
var b
var iv = new Buffer('Ahbool\0\0', 'binary'); //length=16
var key = new Buffer('dzxh0010', 'binary');//length=30
function aa(){
	 cipher = crypto.createCipheriv("des", key,iv);  
	 a = cipher.update(str,'utf8','base64') 
	 b = cipher.final('base64');
}
aa()
console.log(a)
console.log(b)
var a1="abcd"
var a2="abc"+"d"
console.log(a1==a2)
console.log(a1===a2)
