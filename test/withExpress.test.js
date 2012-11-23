var h4e = require('../')
  , path = require('path')
  , app = require('express')()
  , request = require('request')
  , testHandler = function (req, res, next) {}   // stub
  ;

// The actual tests are defined at first here because we use them twice (for automatic setup and Express native way)
function shouldSupportLocals(done) {
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
}

function shouldSupportPartials (done) {
  testHandler = function (req, res, next) {
    var values = { user: { username: 'Grafitti', species: 'cat', gender: 'female' }
                 };
    res.render('withPartials', { values: values });
  };

  request.get({ headers: {"Accept": "application/json"}
              , uri: 'http://localhost:8686/test' }, function (error, response, body) {
    response.statusCode.should.equal(200);
    body.should.equal('Hello Grafitti.\nYou are a female cat.\n');
    done();
  });
}

function shouldEnableLayouts (done) {
  // We will render layout.mustache with the partial partials/description as the content
  testHandler = function (req, res, next) {
    var values = { user: { username: 'Grafitti', species: 'cat', gender: 'female' }
                 }
      , partials = { content: '{{>partials/description}}' }
      ;
    res.render('layout', { values: values, partials: partials });
  };

  request.get({ headers: {"Accept": "application/json"}
              , uri: 'http://localhost:8686/test' }, function (error, response, body) {
    response.statusCode.should.equal(200);
    body.should.equal('Header.\nYou are a female cat.\nFooter.\n');
    done();
  });
}


// Test suites
describe("Test h4e with Express and the automatic setup", function() {
	before(function(done) {
    if (path.basename(process.cwd()) !== 'test') {   // chdir into test if we're not already in it
      process.chdir('test');
    }

    app.use(app.router);
    app.get('/test', function (req, res, next) { testHandler(req, res, next); });

    h4e.setup({ app: app
              , extension: 'mustache'
              , baseDir: 'templates'
              , targets: ['.']
              });

   app.listen(8686);
   done();
	});


	it('Should support locals', shouldSupportLocals);
  it('Should support partials', shouldSupportPartials);
  it('Should enable usage of layouts', shouldEnableLayouts);

});
