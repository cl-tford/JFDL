var _ = require('underscore');
var Mixable = require('./mixable.js');

var modulesById = {};


function getModuleById(id) {
  return modulesById[id];
}

function storeModuleById(id, module) {
  modulesById[id] = module;
}

// Class
var Module = function Module(options) {
  this._id = options.id;
  this._dependencies = options.dependencies;
};

// Class Methods
_.extend(Module, Mixable, {
  getById : function(id) {
    var module = getModuleById(id);
    
    if (!module) {
      module = require('./' + id.toLowerCase() + '.js');
      storeModuleById(id, module);
    }    
    return module;
  }
});

// Instance Methods
_.extend(Module.prototype, {
  getId : function() {
    return this._id;
  },

  getDependencies : function() {
    return this._dependencies.slice(0);
  },

  getNeighbors : function() {
    var neighbors = [];
    
    _.each(this.getDependencies(), function(dependency) {
      var module = Module.getById(dependency);

      neighbors.push(module);
    });
    return neighbors;
  }
});
   
module.exports = Module;
