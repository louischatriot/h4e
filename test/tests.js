var h4e = require('../')
  , app = require('express')();

describe("Test h4e", function() {
	before(function(done) {
    h4e.setup( { extension: 'mustache'
               , baseDir: 'templates'
               , targets: ['.']
               }
             , function () {
                 process.chdir('test');
                 console.log(process.cwd());
                 done();
               });
	});


	it('should support locals', function(done){
    var t = h4e.render('templates/onlyLocals', { values: { planet: "World" } });
    t.should.equal('Hello <b>World</b> !\n');
		done();
	});

	it('should support rendering a string', function(done){
		done();
	});
});
