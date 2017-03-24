var hbs = require('hbs');


// handlebar helpers
var blocks = {};
hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block)
      block = blocks[name] = [];

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');
    blocks[name] = [];
    return val;
});


hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

hbs.registerHelper('link_to', function (slug, path) {
  return '/' + slug.join('/') + path;
});

hbs.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper('unlessvalue', function (conditional, options) {
  if (options.hash.value !== conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("log", function(something) {
  console.log(something);
});
