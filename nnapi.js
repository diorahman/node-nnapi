/**
 * nnapi is part of node-nnapi
 * Copyright (c) 2012 Dhi Aurrahman
 *
 * node-nnapi is freely distributable under the MIT license.
 *
 */

(function (exports) {
	
	var https = require('https');
	var digest = require('./digest');
	var querystring = require('querystring');
	var xml2js = require('xml2js');
	var _ = require('underscore');
	var util = require('util');
	var parser = new xml2js.Parser();
	
	
	var hosts = {
		'sandbox' : 'alpha.one.ovi.com',
		'production' : 'nnapi.ovi.com',
		'chinaProduction' : 'nnapi.ovi.com.cn'
	}
	
	var request = function(options, callback){
		
		options.host = hosts[options.hostType];
		options.port = 443;
				
		digest.headers(options, function(err, headers){
			
			if(!options.headers) options.headers = {};
			
			_.extend(options.headers, headers);
			
			if(options.method != 'GET' && !options.binary ) 
				_.extend(options.headers, {'Content-length' : Buffer.byteLength(options.body, 'utf8')});
			
			var req = https.request(options, function(res){
				var data = '';
								
				res.on('data', function(chunk){
					data += chunk;
				});
				
				res.on('end', function(){
					
					var reply = {
						statusCode : res.statusCode,
						data : data
					}
					
					callback(null, reply)
				});
			});
			if(options.body) req.write(options.body);
			req.end();
			req.on('error', callback);
						
		});
	}
	
	exports.applicationId = function(serviceId){
		var arr = serviceId.split('.');
		if(!arr.length) return serviceId;
		
		var appId = '';
		for(var i = arr.length - 1; i > -1 ; i--){ appId += arr[i] + '.'; }
		return appId.substring(0, appId.lastIndexOf('.'));
	}
	
	exports.version = function(options, callback){
		var opt = {
			hostType : options.hostType,
			method : 'GET',
			path : '/nnapi/version',
			credentials : options.credentials
		}
		request(opt, function(err, data){
			if(err || !data) return callback(err);
			parser.parseString(data.data, function(err, data){
				if(err || !data) return callback(err);
				
				var versionObj = {
					version : data['#'],
					description : data['@'].desc
				}
				
				callback(null, versionObj);
			});
		});
	}
	
	exports.ping = function(options, callback){
		
		var version = options.version ? options.version : '1.0'
		
		var opt = {
			hostType : options.hostType,
			method : 'GET',
			path : '/nnapi/' + version + '/ping',
			credentials : options.credentials
		}
		request(opt, callback);
	}
	
	exports.limits = function(options, callback){
		
		var version = options.version ? options.version : '1.0'
		
		var opt = {
			hostType : options.hostType,
			method : 'GET',
			path : '/nnapi/' + version + '/limits',
			credentials : options.credentials
		}
		request(opt, function(err, data){
			if(err || !data) return callback(err);
			
			data.data = data.data.split('</notifications>').join('</notificationrate>');
			
			parser.parseString(data.data, function(err, data){
				if(err || !data) return callback(err);
				
				var limitsInfo = {
					limits : {
						payload : data.payload['#'],
						rate : data.notificationrate['#'],
						bulkSize : data.bulknotificationsize['#'],
						unit : 'kB'
					}
				}
				
				callback(null, limitsInfo);
			});
		});
		
	}
	
	exports.users = function(options, callback){
		
		var version = options.version ? options.version : '1.0'
		
		var opt = {
			hostType : options.hostType,
			method : 'GET',
			path : '/nnapi/' + version + '/users',
			credentials : options.credentials
		}
		request(opt, function(err, data){
			if(err || !data) return callback(err);
			parser.parseString(data.data, function(err, data){
				if(err || !data) return callback(err);
				
				var usersInfo = {
					users : {
						online : data.online['#'],
						subscribers : data.subscribers['#']
					}
				}
				
				callback(null, usersInfo);
			});
		});
	}
	
	exports.send = function(options, callback){
		
		// ref: https://projects.developer.nokia.com/notificationsapi/wiki/serviceapireference#post
		
		var version = options.version ? options.version : '1.0'
		var path = '/nnapi/' + version;
		
		if(options.bulk)
			path += '/bulk';
			
		if(!options.id)
			return callback(new Error());
			
		if(options.idType == 'nid'){
			path += '/nid/' + (options.bulk ? '' : encodeURIComponent(options.id));
		}else{
			path += '/jid/' + (options.bulk ? '' : (options.binary ? options.id + '/' + this.applicationId(options.credentials.username) : options.id ));
			
			
		}
		
		if(options.bulk && !options.binary){
			if(util.isArray(options.id))
			_.extend(options.body, {id : options.id.join(',')});
			else
			_.extend(options.body, {id : options.id});
		}
				
		var opt = {
			hostType : options.hostType,
			method : options.binary ? 'PUT' : 'POST',
			path : path, 
			credentials : options.credentials,
			body : options.binary ? new Buffer(options.body).toString('base64') : querystring.stringify(options.body),
			headers : {
				'Content-Type' : options.binary ? options.contentType : 'application/x-www-form-urlencoded',
			}
		}
		
		request(opt, callback);			
	}
	
	exports.publish = function(options, callback){
		// ref: https://projects.developer.nokia.com/notificationsapi/wiki/serviceapireference#publishnotifsending
		
		var version = options.version ? options.version : '1.0'
		
		var opt = {
			hostType : options.hostType,
			method : 'POST',
			path : '/nnapi/' + version + '/publish', 
			credentials : options.credentials,
			body : querystring.stringify(options.body),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
			}
		}
	
		request(opt, callback);			
	}
	
	exports.bulk = function(options, callback){
		// ref: https://projects.developer.nokia.com/notificationsapi/wiki/serviceapireference#bulknotifsending
		// TODO: the result should aware of details and expired-at params
		
		var version = options.version ? options.version : '1.0'
		options.bulk = true;
		this.send(options, function(err, data){
			if(err || !data) return callback(err);
			parser.parseString(data.data, function(err, data){
				if(err || !data) return callback(err);
				
				var reportInfo = {
					report : {
						requested : data.requested['#'],
						sent : data.sent['#']
					}
				}
				callback(null, reportInfo);
			});			
		});
	}
	
	exports.sendBinary = function(options, callback){
		// ref: https://projects.developer.nokia.com/notificationsapi/wiki/serviceapireference#put
		
		var version = options.version ? options.version : '1.0'
		options.binary = true;
		options.contentType = options.contentType ? options.contentType : 'application/octet-stream';
		this.send(options, callback);
	}
	
	
}(typeof exports === 'undefined' ? this._ = {}: exports));
