/**
 * digest is part of node-nnapi
 * Copyright (c) 2012 Dhi Aurrahman
 *
 * node-nnapi is freely distributable under the MIT license.
 *
 */

(function (exports) {
	
	var crypto = require('crypto');
	var https = require('https');
	var _ = require('underscore');
	
	var md5 = function(data){
	  return crypto.createHash('md5').update(data).digest('hex');
	}

	var h1 = function(username, realm , password){
	  return hash(username, realm, password);
	}

 	var h2 = function(method, uri){
	  return hash(method, uri);
	}

	var response = function(h1, nonce, nc, cnonce, qop, h2){
	  return hash(h1, nonce, nc, cnonce, qop, h2);
	}

	var hash = function(){
	  return md5((Array.prototype.slice.call(arguments)).join(':'));
	}
	
	var randomString = function(bits){
	  var chars, rand, i, ret;

	  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
	  ret = '';
	  while(bits > 0){
	    rand = Math.floor(Math.random() * 0x100000000);
	    for(i = 26; i > 0 && bits > 0; i-= 6, bits -= 6){
	      ret += chars[0x3F & rand >>> i];
	    }
	  }
	  return ret;
	}
	
	var authInfo = function(options, callback){
		
		var opt = {
			host : options.host,
			port : options.port,
			path : options.path,
			method : 'HEAD'
		}
		
		var req = https.request(opt, function(res){
			res.on('end', function(){
				callback(null, res.headers['www-authenticate']);
			})
		});
		
		req.end();

		req.on('error', function(e) {
		  callback(e);
		});
	}
		
	exports.headers = function(options, callback){
		
		authInfo(options, function(err, info){
			var arr = info.split(' ');
			var digestObj = {};
			for(var i = 1; i < arr.length; i++){
				var obj = arr[i].split('=');
				digestObj[obj[0]] = (obj[1].indexOf(',') > -1 ? 
				obj[1].substring(0, obj[1].indexOf(",") ) : obj[1]).split('"').join('');
			}
			
			var cnonce = 'MTMzMjU4';
			var nc = '00000001';
			
			var ha1 = h1(options.credentials.username, digestObj.realm, options.credentials.password);
			var ha2 = h2(options.method, options.path);
			var r = response(ha1, digestObj.nonce, nc, cnonce, digestObj.qop, ha2);
			
			var authorization =  {
				response : r,
				nc : nc,
				cnonce : cnonce,
				uri : options.path
			}
			
			_.extend(authorization, digestObj);		
			_.extend(authorization, {username : options.credentials.username});
			
			var authStr = '';
			
			for(var key in authorization){
				authStr += key + '="' + authorization[key]  + '", '
			}
			
			var headerObj = {
				'Authorization' : 'Digest ' + authStr.substring(0, authStr.lastIndexOf(',')),
				 'Accept' : '*/*'
			}
			
			callback(null, headerObj);
			
		});
		
		
		/*getAuthInfo(host, endpoint, function(err, info){
			
			if(err) return callback(new Error());
			
			var authorization = prepareAuthorization(info['www-authenticate'], method, endpoint, credential);
			
			if(!authorization) return callback(new Error());
			
			_.extend(authorization, {
				username : credential.username,
				uri : endpoint,
			});
			
			var authStr = '';
			
			for(var key in authorization){
				authStr += key + '="' + authorization[key]  + '", '
			}
			
			var headerObj = {
				'Authorization' : 'Digest ' + authStr.substring(0, authStr.lastIndexOf(',')),	
				'Accept' : ''
			}
			
			console.log(headerObj);
			
			return callback(null, headerObj);
		});*/
	}
	
	exports.test = function(username, password, realm, nonce, nc, cnonce, qop, method, uri){
		return (response(h1(username, realm, password), nonce, nc, cnonce, qop, h2(method, uri)));
	}
	
}(typeof exports === 'undefined' ? this._ = {}: exports));
