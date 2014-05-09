var $ = require('jquery'); 
var _ = require('underscore');
var Backbone = require('backbone'); 

// https://github.com/logicalparadox/backbone.iobind/blob/master/dist/backbone.iosync.js

module.exports = function (method, model, options) {

  var params = _.extend({}, options)

  if (params.url) {
    params.url = _.result(params, 'url');
  } else {
    params.url = _.result(model, 'url') || urlError();
  }

  var cmd = params.url.split('/')
    , namespace = (cmd[0] !== '') ? cmd[0] : cmd[1]; // if leading slash, ignore

  if ( !params.data && model ) {
    params.data = params.attrs || model.toJSON(options) || {};
  }

  if (params.patch === true && params.data.id == null && model) {
    params.data.id = model.id;
  }

  // If your socket.io connection exists on a different var, change here:
  var io = model.socket || Backbone.socket || window.socket

  //since Backbone version 1.0.0 all events are raised in methods 'fetch', 'save', 'remove' etc

  var defer = $.Deferred();
  io.emit(namespace + ':' + method, params.data, function (err, data) {
    if (err) {
      console.log('Error :( ', err);
      for(var i in err){
        console.log("- ", i, err[i]);
      }
      if(options.error) options.error(err);
      defer.reject();
    } else {
      if(options.success) options.success(data);
      defer.resolve();
    }
  });
  var promise = defer.promise();
  model.trigger('request', model, promise, options);
  return promise;
};


/*
module.exports = function(method, model, options) {

  options || (options = {});

  console.log(method, model, options);

  switch (method) {
    case 'create':
    	
    break;

    case 'update':
    break;

    case 'delete':
    break;

    case 'read':
    	
    break;
  }
};

*/



/*
Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };
*/
  