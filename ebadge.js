var mysql = require("mysql")
var connection = mysql.createConnection({   
	host     : '127.0.0.1',       //主机
	user     : 'smart',               //MySQL认证用户名
	password : '12341234qwer',        //MySQL认证用户密码
	port     : '3306'    ,              //端口号
	database : 'smartserver',
});
 
//创建一个connection
 
connection.connect(function(err){
 
	if(err){       
	 
		console.log('[query] - :'+err);
	 
		return;
	 
	}
 
	console.log('[connection connect]  succeed!');
	
 
}); 
logInfo(0,"连接数据库成功")

var net = require('net');
var timeout = 20000;//超时
var listenPort = 8800;//监听端口

var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    var keystr=""
    console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort);
    logInfo(0,'connect: ' + socket.remoteAddress + ':' + socket.remotePort)
    socket.setEncoding('utf-8');
    certstr = MakeCertStr()
    certstrobj = JSON.parse(certstr)
    keystr =  certstrobj.value
    socket.write(certstr);
    logInfo(0,'connect: ' + socket.remoteAddress + ':' + socket.remotePort+"=="+certstr)
    //超时事件
    socket.setTimeout(timeout,function(){
        console.log('连接超时');
        logInfo(1,'连接超时')
        socket.end();
    });
  
    //接收到数据
    socket.on('data',function(data){

        console.log('recv:' + data+typeof data)
  //returnCertObj = eval('('+data+')')
  	var returnCertObj
    try{
       returnCertObj = JSON.parse(data)
        
    }
    catch(e){
	   	if (returnCertObj ==  null) {
	    	console.log('接收到非json数据：' + data)
	    	logInfo(1,'接收到非json数据：' + data)
	    	socket.end
	    }
	   	
    }
    if (returnCertObj.value.auth != keystr.value) {
        	console.log('接收到auth数据不符合：' + data)
        	logInfo(1,'接收到auth数据不符合：' + data)
        	socket.end
        }
    okstrobj={}
    okstrobj.name = "SERVER_AUTH_RESU"
    okstrobj.value = "SUCC" +  returnCertObj.name       
    socket.write(JSON.stringify(okstrobj))    
       

    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' + socket.remoteAddress + ' ' + socket.remotePort);

    });


}).listen(listenPort);

//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
}); 



function GetRandom16Ascii(){
	var allchars =""
	min = Math.ceil(1);
    max = Math.floor(255);
    for(i=0;i<8;i++){
	    rand_int =  Math.floor(Math.random() * (max - min)) + min;
	    onechar = rand_int.toString(16).toUpperCase();
	    allchars = allchars + onechar;
    }
    return allchars;
}


function MakeCertStr(){
	strobj = {}
	strobj.name = "SERVER-AUTH-REQ";
	strobj.value = GetRandom16Ascii() ;
	return JSON.stringify(strobj);
	
}


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
//connection.end()
