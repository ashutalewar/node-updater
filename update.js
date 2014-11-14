'use strict';

var request = require('request');
var fs = require('fs')
var token = '123456';

function postrequest(path, send_data, type, callback){
	if(type == 'GET') {
		path = path+ '?' + send_data;
		send_data = '';
		
		request.get({
	    uri:"http://localhost"+path,
	    headers:{'content-type': 'application/x-www-form-urlencoded'},
	    body:send_data
	    },function(err,res,body){
	        //console.log(body);
	        callback(body);
	        //console.log(res.statusCode);
		});
	}
	else{		
		request.post({
	    uri:"http://localhost"+path,
	    headers:{'content-type': 'application/x-www-form-urlencoded'},
	    body:send_data
	    },function(err,res,body){
	        //console.log(body);
	        callback(body);
	        //console.log(res.statusCode);
		});
	}

}



exports.test = function(req, callback){
	var path = '/api/getversion';
	var type = 'GET';
	var send_data = 'version='+"1.0.2";	
	postrequest(path,send_data, type, function(data){
		callback(data);
	});
}

getVersion()

function getVersion(){
    fs.readFile('./config.js', 'utf8', function (err, data) {
        if (err) throw err;
        //Do your processing, MD5, send a satellite to the moon, etc.

        console.log(data)

        var x = JSON.parse(data)
        x.current = "4"

        fs.writeFile ('./config.js', JSON.stringify(x), function(err) {
            if (err) throw err;
            console.log('complete');
        });
    });
}

var version = "leafHub"

require("../"+version)