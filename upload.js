var crypto = require('crypto')  

function md5(plainstr){  
	var str = plainstr
    var decipher = crypto.createHash('md5')  
 
    return decipher.update(str).digest('hex')  
}  

var mysql = require("mysql")
var connection = mysql.createConnection({   
	host     : '127.0.0.1',       //主机
	user     : 'smart',               //MySQL认证用户名
	password : '12341234qwer',        //MySQL认证用户密码
	port     : '33306'    ,              //端口号
	database : 'smartserver',
});
 
//创建一个connection
 
connection.connect(function(err){
 
	if(err){       
	 
		console.log('[connect] - :'+err);
	 
		return;
		process.exit(1);
	 
	}
 
	console.log('[connection connect]  succeed!');
	
 
}); 
function logInfo(ltype,linfo){
	var  logSql = 'INSERT INTO log_tb(type,info,state,ltime) VALUES(?,?,?,?)';
	var d = new Date()
	var timestr=""
	timestr = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
	var  logSql_Params = [ltype,linfo,0, timestr   ];
	
	connection.query(logSql ,logSql_Params,function (err, result) {
		if(err){
			console.log('[INSERT ERROR] - ',err.message);
			return;
		}       
	});
	
}
logInfo(0,"上传数据连接本地数据库成功")


var reqData={
}




 
//http://api.yudianedu.cn/v3/web/Rest/badge/receive
var post_options = {
    host: 'api.yudianedu.cn'
    port: '80',
    path: '/v3/web/Rest/badge/receive',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': reqData.length
    }
  };
 
  var post_req = http.request(post_options, function (response) {
    var responseText=[];
    var size = 0;
    response.on('data', function (data) {
      responseText.push(data);
      size+=data.length;
    });
    response.on('end', function () {
      // Buffer 是node.js 自带的库，直接使用
      responseText = Buffer.concat(responseText,size);
      callback(responseText);
    });
  });
 
  // post the data
  connection.query('select * from io_tb where up = 0', function(err, rows, fields) {
    if (err) throw err;
    console.log('查询结果为: ', rows);
    for(var idx in rows){
       reqData = rows[idx]
       plainstr = "id="+reqData.id+"&status="+reqData.state+"&time="+reqData.ctime+"&key=yudianedutest"
       reqData.sign = md5(plainstr)
       post_req.write(reqData);
    }
});
 
  post_req.end();
