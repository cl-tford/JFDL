var _ = require('underscore');

var modulesById = {};

function getModuleById(id) {
  return modulesById[id];
}

function storeModuleById(id, module) {
  modulesById[id] = module;
}

var Module = function Module(id, constructor, dependencies) {
  if (!dependencies) {
    dependencies = [];
  }
  _.extend(constructor, {
    getId : function() {
      return id;
    },
    
    getDependencies : function() {
      return dependencies.slice(0);
    },
    
    getNeighbors : function() {
      var neighbors = [];

      _.each(this.getDependencies(), function(dependency) {
        var module = getModuleById(dependency);

        if (!module) {
          console.log("Inside getNeighbors, about to require:\n", './' + dependency + './js');
          module = require('./' + dependency + '.js');
          storeModuleById(dependency, module);
        }
        neighbors.push(module);
      });
      return neighbors;
    },

    getNeighbor : function(id) {
      return getModuleById(id);
    }
  });
  return constructor;
};

module.exports = Module;
