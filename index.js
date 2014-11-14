'use strict';

var request = require('request');
// var ghdownload = require('github-download')
var exec = require('exec')
var fs = require('fs')

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

init()

function init(){
	getVersion(function(data){
		var version = data.current
		require("../"+version)
	})
}

//this function regularly checks for the update
setInterval(function(){
	check()
}, 24*60*60*1000)


function check(){
	var path = '/api/getversion';
	var type = 'GET';
	var send_data = 'version='+"1.0.2";	
	postrequest(path,send_data, type, function(data){
		console.log(data)
		var server_data = JSON.parse(data)
		if(data.status){
			getVersion(function(status, local_data){
				if(status){
					if (local_data.latest == server_data.data.leafHub) {

						//update if current version is not equal to latest version available
						if(local_data.current != local_data.latest)  initiateUpdate(local_data)

					}else{
						local_data.latest = server_data.data.leafHub
						changeVersion(local_data.latest)
					}
				}else{
					console.log("unable to access local data")
				}
			})
		}else{
			console.log("unable to check update")
		}



	});
}

function initiateUpdate(data){
	var version_to_install = data.latest
	download(version_to_install, function(status){
		if(status){
			data.downloaded.push(version_to_install)
			changeVersion(data)
			install(function(status){
				if(status){
					data.current = version_to_install;
					changeVersion(data);
				}else{
					console.log("failed to install")
				}
			})

		}else{
			console.log("download failed")
		}
	})
}

function getVersion(callback){
    fs.readFile('./version.json', 'utf8', function (err, data) {
        if (err) {
        	callback(false, null)
        	throw err;
        }else{
        	callback(true,JSON.parse(data))
        }
    });
}

function changeVersion(data){
   fs.writeFile ('./version.json', JSON.stringify(data), function(err) {
        if (err) {
        	// callback(false, null)
        	throw err;
        }else{
        	console.log(completed)
        	// callback(true,data)
        }
    });
}


function download(version, callback){
	callback(true)
}

function install(version, callback){
	callback(true)
}

