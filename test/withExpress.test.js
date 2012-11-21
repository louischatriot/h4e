var h4e = require('../')
  , path = require('path')
  , app = require('express')()
  , request = require('request')
  ;

describe("Test h4e with Express", function() {
	before(function(done) {
    if (path.basename(process.cwd()) !== 'test') {   // chdir into test if we're not already in it
      process.chdir('test');
    }

    app.use(app.router);
    app.get('/onlyLocals', function (req, res, next) {
      return res.json(409, {});
    });

    h4e.setup( { app: app
               , extension: 'mustache'
               , baseDir: 'templates'
               , targets: ['.']
               }
             , function () {
                 app.listen(8686);
                 done();
               });
	});


	it('Should support locals', function(done){
      
    request.get({ headers: {"Accept": "application/json"}
                , uri: 'http://localhost:8686/onlyLocals' }, function (error, response, body) {
      console.log(response);
      done();
    });


    //var t = h4e.render('onlyLocals', { values: { planet: "World"
                                               //, user: { username: 'Grafitti' }
                                               //}
                                     //});
    //t.should.equal('Hello <b>World</b> !\nYour username is Grafitti.\n');
		//done();
	});

	//it('should support rendering a string', function(done){
    //var t = h4e.render('I like {{animal}}.', { values: { animal: "cats"
                                            //}
                                     //});
    //t.should.equal('I like cats.');
		//done();
	//});

  //it('Should support partials', function(done){
    //var t = h4e.render('withPartials', { values: { user: { username: 'Grafitti', species: 'cat', gender: 'female' }
                                                 //}
                                       //});
    //t.should.equal('Hello Grafitti.\nYou are a female cat.\n');
		//done();
	//});

});
