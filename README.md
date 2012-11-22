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

h4e.setup({ app: app
          , extension: 'mustache'
          , baseDir: 'templates' 
          , toCompile: ['website', 'forum'] });

// Rest of Express code here
```

Assuming `./templates/website/hello.mustache` contains `Hello {{planet}} ! {{>website/description}}`, and
`./templates/website/description.mustache` contains `You are blue`, your request handlers will be:

```javascript
app.get('/test', function (req, res, next) {
  values = { planet: 'World' };

  // Renders 'Hello World ! You are blue'
  res.render( 'website/', { values: values } );
});

```



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