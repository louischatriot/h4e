var h4e = require('../')
  , app = require('express')();

describe("Test h4e", function() {
	before(function(done) {
    process.chdir('test');

    h4e.setup( { extension: 'mustache'
               , baseDir: 'templates'
               , targets: ['.']
               }
             , function () {
                 done();
               });
	});


	it('should support locals', function(done){
    var t = h4e.render('onlyLocals', { values: { planet: "World" } });
    t.should.equal('Hello <b>World</b> !\n');
		done();
	});

	it('should support rendering a string', function(done){
		done();
	});
});
