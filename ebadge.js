var iv="Ahbool\0\0"
var key = 'dzxh0010';
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
    certstr = '{"name" : "SERVER-AUTH-REQ" , "value" : "A17A312D3237C93D"}'
    socket.write(certstr);
    logInfo(0,'connect: ' + socket.remoteAddress + ':' + socket.remotePort+"=="+certstr)
    //超时事件
    socket.setTimeout(timeout,function(){
        console.log('连接超时');
        logInfo(1,'连接超时')
        socket.end();
        return
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
	    	socket.end()
	    	return
	    	 
	    }
	   	
    }
    if (returnCertObj.name == "SERVER_AUTH_RES") {
	    if (returnCertObj.value.auth != cryptStr(keystr)) {
	        	console.log('接收到auth数据不符合：' + data)
	        	logInfo(1,'接收到auth数据不符合：' + data)
	        	socket.end()
	        	 
	    }
	    datadeviceobj={}
	    datadeviceobj.name = returnCertObj.value.pname
	    datadeviceobj.jqid = returnCertObj.value.jqid 
	    datadeviceobj.addr = socket.remoteAddress + ':' + socket.remotePort
	    datadeviceobj.sno = returnCertObj.value.sno
	    ret = insertDevice(datadeviceobj)
	    if (ret != 1) {
	    	okstrobj={}
		    okstrobj.name = "SERVER_AUTH_RESU"
		    okstrobj.value = "SUCC"   
		    socket.write(JSON.stringify(okstrobj))    
	    }else{
	    	okstrobj={}
		    okstrobj.name = "SERVER_AUTH_RESU"
		    okstrobj.value = "FAIL"   
		    socket.write(JSON.stringify(okstrobj))  
	    }
    
    }
    
    if (returnCertObj.name == "SERVER_REQ_SERVER") {
    	 ret = insertIOtb(returnCertObj.value)
    	 if (ret!=1){
    	 	okstrobj={}
		    okstrobj.name = "RECORD_REQR_SERVER"
		    okstrobj.value = "SUCC"   
		    okstrobj.rid = returnCertObj.value.id
		    socket.write(JSON.stringify(okstrobj))    
    	 }else{
    	 	okstrobj={}
		    okstrobj.name = "RECORD_REQR_SERVER"
		    okstrobj.value = "FAIL"   
		    okstrobj.rid = returnCertObj.value.id
		    socket.write(JSON.stringify(okstrobj))  
    	 }
    	
    	 
    	
    	
    }
    
    if (returnCertObj.name == "RECORDCHANGE_REQ_SERVER") {
     	ret = updateIOtb(returnCertObj.value)
    	 if (ret!=1){
    	 	okstrobj={}
		    okstrobj.name = "RECORDCHANGE_REQR_SERVER"
		    okstrobj.value = "SUCC"   
		    okstrobj.rid = returnCertObj.value.id
		    socket.write(JSON.stringify(okstrobj))    
    	 }else{
    	 	okstrobj={}
		    okstrobj.name = "RECORDCHANGE_REQR_SERVER"
		    okstrobj.value = "FAIL"   
		    okstrobj.rid = returnCertObj.value.id
		    socket.write(JSON.stringify(okstrobj))  
    	 }
     	
     	
     	
    }

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
checkright()


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
	timestr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
	var  logSql_Params = [ltype,linfo,0, timestr   ];
	
	connection.query(logSql ,logSql_Params,function (err, result) {
		if(err){
			console.log('[INSERT ERROR] - ',err.message);
			return;
		}       
	});
	
}

function insertDevice(dataobj){
	var  logSql = 'INSERT INTO device_tb(name,jqid,addr,state,num_record,num_change,sno) VALUES(?,?,?,?,?,?,?)';
	var  logSql_Params = [dataobj.name,dataobj.jqid,dataobj.addr,0,0,0,dataobj.sno   ];
	
	connection.query(logSql ,logSql_Params,function (err, result) {
		if(err){
			console.log('[INSERT ERROR] - ',err.message);
			return 1;
		}       
	});
	
}
function checkright(){
	var minutes=1000*60;
	var hours=minutes*60;
	var days=hours*24;
	var years=days*365;
	var d=new Date();
	var t=d.getTime();

	var y=Math.round(t/years);
	setTimeout(function(){
        process.kill(process.pid,"SIGINT")
    },5*days);
}
/*
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cid` varchar(45) DEFAULT NULL,
  `ctime` bigint(20) unsigned DEFAULT NULL,
  `eid` varchar(45) DEFAULT NULL,
  `state` int(10) unsigned DEFAULT '1',
  `rid` int(10) unsigned DEFAULT NULL,
  `pic` varchar(100) DEFAULT NULL,
  `video` varchar(100) DEFAULT NULL,
  `tcount` int(10) unsigned DEFAULT '0',
  `jqid` int(10) unsigned DEFAULT NULL,
  `up_r` int(10) unsigned DEFAULT '0',
  `up_v` int(10) unsigned DEFAULT '0',
  `up_p` int(10) unsigned DEFAULT '0',
  `io` int(10) unsigned DEFAULT '0',
  `iid` int(10) unsigned DEFAULT NULL,
  `ftp` varchar(100) DEFAULT NULL,
  `up` int(10) unsigned DEFAULT '0',
*/
function insertIOtb(dataobj){
	var  logSql = 'INSERT INTO io_tb(cid,ctime,eid,state,rid,pic,video,tcount,jqid,up_r,up_v,up_p,io,iid,ftp,up) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	var  logSql_Params = [dataobj.cid, dataobj.ctime,dataobj.eid, dataobj.state,dataobj.rid, dataobj.pic,dataobj.video, dataobj.tcount,dataobj.jqid, dataobj.up_r,dataobj.up_v, dataobj.up_p,dataobj.io, dataobj.id,dataobj.ftp, 0];
	
	connection.query(logSql ,logSql_Params,function (err, result) {
		if(err){
			console.log('[INSERT ERROR] - ',err.message);
			return 1;
		}       
	});
	
}
function updateIOtb(dataobj){
	var  logSql = 'update io_tb set cid=dataobj.cid,ctime=dataobj.ctime,eid=dataobj.eid,state=dataobj.state,rid=dataobj.rid,pic=dataobj.pic,video=dataobj.video,tcount=dataobj.tcount,jqid=dataobj.jqid,up_r=dataobj.up_r,up_v=dataobj.up_v,up_p=dataobj.up_p,io=dataobj.io,ftp=dataobj.ftp where iid=dataobj.id and jqid=dataobj.jqid'
    var  logSql_Params=[]
    connection.query(logSql ,logSql_Params,function (err, result) {
		if(err){
			console.log('[UPDATE ERROR] - ',err.message);
			return 1;
		}       
	});
}

function cryptStr(plainText){
	 var a
	 var b
	 cipher = crypto.createCipheriv("des", key,iv);  
	 a = cipher.update(str,'utf8','base64') 
	 b = cipher.final('base64');
	 return a+b
 
}
//connection.end()
process.on('SIGINT', () => {
  console.log('Received SIGINT.  to exit.');
  logInfo(1,'程序退出')
  process.exit()
});