/* 
	should cover https://projects.developer.nokia.com/notificationsapi/wiki/serviceapireference
*/

var nnapi = require('../nnapi');
var should = require('should');

var version = '1.0';
var serviceId = 'service.aegis.co.id';
var serviceSecret = 'crFjCiG8kL7El+/yfi0z4F6D//tPH8SjK/70qWUX+UA=';
var hostType = 'sandbox'

describe('Read service information', function(){
	describe('#version()', function(){
		it('should return valid version of the service', function(done){
			
			var options = {
				hostType : hostType,
				credentials : {
					username : serviceId,
					password : serviceSecret
				}
			}
			
			nnapi.version(options, function(err, obj){
				if(err) throw err;
				
				console.log(obj.description + ': ' +  obj.version);
				version = obj.version;
				version.should.not.equal('');
				done();
			});
		})
	});
	
	describe('#ping()', function(){
		it('should return "Ok"', function(done){
			
			version.should.not.equal('');
			
			var options = {
				hostType : hostType,
				version : version,
				credentials : {
					username : serviceId,
					password : serviceSecret
				}
			}
			
			nnapi.ping(options, function(err, msg){
				
				if(err) throw err;
				
				console.log('reply from service: ' +  JSON.stringify(msg));
				msg.data.should.equal('Ok');
				done();
			});
		})
	});
	
	describe('#limits()', function(){
		it('should return "Ok"', function(done){
			
			version.should.not.equal('');
			
			var options = {
				hostType : hostType,
				version : version,
				credentials : {
					username : serviceId,
					password : serviceSecret
				}
			}
			
			nnapi.limits(options, function(err, info){
				
				if(err) throw err;
				
				console.log('payload limit: ' +  info.limits.payload + ' ' + info.limits.unit);
				console.log('bulk notification size limit: ' +  info.limits.bulkSize + ' ' + info.limits.unit);
				console.log('rate: ' +  info.limits.rate);
				
				done();
			});
		})
	});
	
	describe('#users()', function(){
		it('should return users of service information', function(done){
			
			version.should.not.equal('');
			
			var options = {
				hostType : hostType,
				version : version,
				credentials : {
					username : serviceId,
					password : serviceSecret
				}
			}
			
			nnapi.users(options, function(err, info){
				
				if(err) throw err;
				
				console.log('online: ' +  info.users.online);
				console.log('subscribers: ' +  info.users.subscribers);
				done();
			});
		})
	});

})
