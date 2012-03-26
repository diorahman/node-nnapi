/* 
	should cover https://projects.developer.nokia.com/notificationsapi/wiki/serviceapireference
	
	TODO:
	- using NID
	- put binary from file stream, e.g. image file
*/

var nnapi = require('../nnapi');
var should = require('should');

var version = '1.0';
var serviceId = 'serviceId'; // https://projects.developer.nokia.com/notificationsapi/wiki/registerservice
var serviceSecret = 'serviceSecret';
var hostType = 'sandbox' // hostType could be: 'sandbox', 'production', 'chinaProduction'
var id = 'test-id@ovi.com' // a nokia user id from https://account.nokia.com

describe('Write to service', function(){
	describe('#send(jid)', function(){
		it('should return 201, 202 or 204', function(done){
			var options = {
				hostType : hostType,
				credentials : {
					username : serviceId,
					password : serviceSecret
				},
				idType : 'jid',
				id : id,
				body : {
					payload : 'test', 
					toapp : nnapi.applicationId(serviceId)
				}
			}
			
			nnapi.send(options, function(err, reply){
				if(err) throw err;
				console.log(reply);
				done();
			});
		})
	});
	
	describe('#publish()', function(){
		it('should return 200 or 204', function(done){
			var options = {
				hostType : hostType,
				credentials : {
					username : serviceId,
					password : serviceSecret
				},
				body : {
					payload : 'test', 
					toapp : nnapi.applicationId(serviceId)
				}
			}
			
			nnapi.publish(options, function(err, reply){
				if(err) throw err;
				console.log(reply)
				done();
			});
		})
	});
	
	describe('#bulk(jid)', function(){
		it('should return 201, 202 or 204', function(done){
			var options = {
				hostType : hostType,
				credentials : {
					username : serviceId,
					password : serviceSecret
				},
				idType : 'jid',
				id : id,
				body : {
					payload : 'test', 
					toapp : nnapi.applicationId(serviceId)
				}
			}
			
			nnapi.bulk(options, function(err, reply){
				if(err) throw err;
				console.log(reply);
				done();
			});
		})
	});
	
	describe('#sendBinary(jid)', function(){
		it('should return 201, 202 or 204', function(done){
			var options = {
				hostType : hostType,
				credentials : {
					username : serviceId,
					password : serviceSecret
				},
				idType : 'jid',
				id : id,
				body : 'test' // should be base64 encoded
			}
			
			nnapi.sendBinary(options, function(err, reply){
				if(err) throw err;
				console.log(reply);
				done();
			});
		})
	});
})
