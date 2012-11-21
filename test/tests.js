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


	it('Should support locals', function(done){
    var t = h4e.render('onlyLocals', { values: { planet: "World"
                                               , user: { username: 'Grafitti' }
                                               }
                                     });
    t.should.equal('Hello <b>World</b> !\nYour username is Grafitti.\n');
		done();
	});

	it('should support rendering a string', function(done){
    var t = h4e.render('I like {{animal}}.', { values: { animal: "cats"
                                            }
                                     });
    t.should.equal('I like cats.');
		done();
	});
});
