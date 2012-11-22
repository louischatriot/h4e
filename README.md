h4e
===

Hogan for Express, with support for partials and layouts.

## Installation

```bash
$ npm install h4e      # Install locally
$ npm install -g h4e   # Install globally
```

## Usage
### Within Express

If you have the typical setup with your main module in `.`, your Mustache templates for the website in `./templates/website` 
and those for the forum in `./templates/forum`, Setting h4e is as simple as:

```javascript
var h4e = require('h4e')
  , express = require('express')
  , app = express();

h4e.setup({ app: app   // Give it your Express app so that it handles all the configuration

          , extension: 'mustache'   // Tell h4e all your templates end in '.mustache'
                                    // and you don't want to type it everytime

          , baseDir: 'templates'    // All your templates are in this directory or its descendants
                                    // Say it here and never type it again, h4e will know where to look

          , toCompile: ['website', 'forum'] });   // The subdirectories of baseDir where your templates
                                                  // really are. Tell h4e to compile them so you
                                                  // can use them

// Rest of Express code here
```

Let's assume:

* `./templates/website/hello.mustache` contains `Hello {{planet}} ! {{>website/description}}`
* `./templates/website/description.mustache` contains `You are {{color}}`

Your request handler will be:

```javascript
app.get('/test', function (req, res, next) {
  var values = { planet: 'World', color: 'blue' };

  // Renders 'Hello World ! You are blue'
  res.render( 'website/hello', { values: values } );
});

```

### That's not enough, I want layouts!
Of course, who doesn't? So let's assume:

* `./templates/website/layout.mustache` contains `Header <b>{{>content}}</b> Footer`
* `./templates/website/pages/index.mustache` contains `Yo {{animal}}, this is the homepage`
* `./templates/website/pages/h4e.mustache` contains `This is {{adjective}} !`

Then your request handlers need to be:

```javascript
app.get('/index', function (req, res, next) {
  var values = { animal: 'dawg' }
    , partials = { content: '{{>website/pages/index}}' }
    ;

  // Renders 'Header <b>Yo dawg, this is the homepage</b> Footer'
  res.render( 'website/layout', { values: values, partials: partials } );
});

app.get('/whatish4e', function (req, res, next) {
  var values = { adjective: 'awesome' }
    , partials = { content: '{{>website/pages/h4e}}' }
    ;

  // Renders 'Header <b>This is awesome !</b> Footer'
  res.render( 'website/layout', { values: values, partials: partials } );
});
```

### I want to use it directly, without Express!
You sure want lots of different things, but that's OK. Set it up without passing a reference to Express, like this:

```javascript
var h4e = require('h4e')
  , express = require('express')
  , app = express();

h4e.setup({ extension: 'mustache'
          , baseDir: 'templates'
          , toCompile: ['emails', 'messages'] });
// Rest of Express code here
```

So now you want to send a welcome email. Let's assume:
* `./templates/emails/welcome.mustache` contains `Hello {{username}} ! Welcome to our service !`

```javascript
var values = { username: 'Grafitti' }
  , emailBody = h4e.render('emails/welcome', { values: values });

// Send an email with emailBody, which is 'Hello Grafitti ! Welcome to our service !'
```

As you can see, very similar to Express' `res.render`, you can use partials and layouts too.




## License 

(The MIT License)

Copyright (c) 2012 tldr.io &lt;meta@tldr.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.