var h4e = require('../')
  , path = require('path')
  , app = require('express')()
  , request = require('request')
  , testHandler = function (req, res, next) {}   // stub
  ;

describe("Test h4e with Express", function() {
	before(function(done) {
    if (path.basename(process.cwd()) !== 'test') {   // chdir into test if we're not already in it
      process.chdir('test');
    }

    app.use(app.router);
    app.get('/test', function (req, res, next) { testHandler(req, res, next); });

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
    testHandler = function (req, res, next) {
      var values = { planet: "World"
                   , user: { username: 'Grafitti' }
                   };
      res.render('onlyLocals', { values: values });
    };

    request.get({ headers: {"Accept": "application/json"}
                , uri: 'http://localhost:8686/test' }, function (error, response, body) {
      response.statusCode.should.equal(200);
      body.should.equal('Hello <b>World</b> !\nYour username is Grafitti.\n');
      done();
    });
	});

  //it('Should support partials', function(done){
    //var t = h4e.render('withPartials', { values: { user: { username: 'Grafitti', species: 'cat', gender: 'female' }
                                                 //}
                                       //});
    //t.should.equal('Hello Grafitti.\nYou are a female cat.\n');
		//done();
	//});

});
