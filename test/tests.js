var h4e = require('../')
  , app = require('express')();

describe("Test h4e", function() {
	before(function(done) {
    h4e(app, { extension: 'mustache'
             , baseDir: 'templates'
             , targets: ['.']
             }
           , function () {
             done();
           });
	});


	it('should support locals', function(done){
		done();
	});

	it('should support rendering a string', function(done){
		done();
	});
});
