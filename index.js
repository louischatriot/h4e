/*
 * Wrapper around Hogan to be used with Express and enjoying support for partials
 * (c) 2012 tldrio <meta@tldr.io>, MIT Licence
 * Project homepage: https://github.com/tldrio/h4e
 */


var hogan = require('hogan.js')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , async = require('async')
  , compiledTemplates = {}
  , extension, templatesDir, targets
  ;


/**
 * Compile all templates in templatesDir/root and put the result in compiledTemplates
 * Used only once at the first rendering, then all compiled templates will be cached for more efficiency
 * @param {String} root directory from which to recursively compile all templates
 * @param {Function} callback to be called after execution. Will be called even if there is an error, since that only means some files were not processed
 */
function readAndCompileTemplates (root, callback) {
  var dir = path.resolve(templatesDir, root);

  fs.readdir(dir, function (err, files) {
    if (err) { return callback(err); }

    async.forEach(
        files
      , function (file, callback) {
          var extname = path.extname(file)
            , basename = path.basename(file, extname)
            , fullname = path.resolve(dir, file)
            ;

          fs.stat(fullname, function (err, stats) {
            if (err) { return callback(err); }
            if (stats.isDirectory()) {
              readAndCompileTemplates(path.join(root, basename), callback);
            }
            if (stats.isFile() && extname === '.' + extension) {
              fs.readFile(fullname, 'utf8', function (err, str) {
                compiledTemplates[path.join(root, basename)] = hogan.compile(str);
                callback();
              });
            }
          });
        }
      , callback
      );

  });
}


/**
 * Actually render the template. The signature is imposed by Express
 * This can only be called once all necessary templates have been compiled, otherwise the usual error will be thrown by Express
 * @param {String} template Path to reach the template from the baseDir
 * @param {Object} options Hogan options. The two most important are options.values and options.partials (names are explicit)
 * @param {Function} fn Optional. Callback supplied by Express once rendering is done. If no callback is supplied, the result of the rendering is simply returned.
 */
function render (template, options, fn) {
  var extname = path.extname(template)
    , basename = path.basename(template, extname)
    , relative = path.relative(templatesDir, template)
    , dirname = path.dirname(relative)
    , keyname = path.join(dirname, basename)
    , templateToRender = compiledTemplates[keyname]

    // If compiledTemplates and options.partials have keys in common, compiledTemplates' will be rewritten
    // which is the intended behaviour because we can override it when we want
    , result = templateToRender.render(options.values, _.extend(_.clone(compiledTemplates), options.partials))
    ;

    //console.log("========");
    //console.log(_.keys(compiledTemplates));
    //console.log(templatesDir);
    //console.log(relative);

  if (fn) {   // render was called by Express
    try {
      fn(null, result);
    } catch (err) {
      fn(err);
    }
  }

  // Render was called directly
  return result;
}


/**
 * Compile the templates and set up express to use this as its rendering engine
 * @param {Object} options Set up options, which are:
 *        {Object} app            Optional. Express app for which we will set up the rendering engine.
 *                                          If none provided we just compile all templates and the user can use the render function
 *        {String} extension      Optional. Only the templates with this extension will be compiled. Defaults to 'mustache'
 *        {String} baseDir        Optional. The base directory where all templates are, not to be repeated in all partials names. Defaults to 'templates'
 *        {Array} toCompileDirs   Optional. All subdirs containing the templates, part of the partials names. Default to ['.']
 * @param {Object} cb Optional callback
 */
function setup (options, cb) {
  var callback = cb || function () {};

  extension = options.extension || 'mustache';
  templatesDir = options.baseDir || 'templates';
  targets = options.toCompileDirs || ['.'];

  // Compile the templates in all target directories
  async.forEach(targets, readAndCompileTemplates, function () {
    // If an Express app was passed in the options, set up its rendering engine to be h4e
    if (options.app) {
      options.app.engine(extension, render);
      options.app.set('view engine', extension);
      options.app.set('views', templatesDir);
    }

    callback();
  });
}


// API
module.exports = { setup: setup, render: render };
