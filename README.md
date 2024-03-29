NNAPI Nokia Notifications API
===

This is a node module for Nokia Notifications API, please take a look at test folder for complete usage
https://projects.developer.nokia.com/notificationsapi/wiki

Install
---
    npm install node-nnapi

Getting Started
---
An example to send a notification to clients through push mechanism

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

Ping the server

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

'hostType' could be 'sandbox', 'production' or 'chinaProduction'

You can get the 'serviceId' and 'serviceSecret' by registering your service by following this walkthrough: https://projects.developer.nokia.com/notificationsapi/wiki/registerservice

You also need a test account from https://account.nokia.com

Test
---
You need to install mocha and should

    $ (sudo) npm install mocha

Then you can do:

    $ make test

TODO 
---
* Cleanup Code
* Tests
* Pull request please! :-) 

LICENSE (MIT)
---

_Copyright (c) 2010 Dhi Aurrahman_

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

