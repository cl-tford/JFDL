var _    = require('underscore');
var Node = require('./node.js');

   
//module.exports = Module;
module.exports = {
  directory : function(directoryName) {
    var modulesById = {};
    
    function getModuleById(id) {
      return modulesById[id];
    }
    
    function storeModuleById(id, module) {
      modulesById[id] = module;
    }
    
    // Class
    var Module = function Module(options) {
      Node.call(this, options);
      this._dependencies = options.dependencies;
//      storeModuleById(this.id, this);
//      storeModuleById(this.getId(), this);
    };
    
    // Class Methods
    _.extend(Module, Node, {
      modulesById : modulesById,
      storeModuleById : storeModuleById,
      getById : function(id) {
console.log("INside /Users/terranceford/JFDL/traversal/module.js.getById, got called with id:\n", id);
        var module = getModuleById(id);
console.log("The result of getModuleById for " + id + " is:\n", module);
        if (!module) {
//          module = require('./' + id.toLowerCase() + '.js');
console.log("Inside getById, about to require:\n", directoryName + '/' + id.toLowerCase() + '.js');
          module = require(directoryName + '/' + id.toLowerCase() + '.js');
          storeModuleById(id, module);
        }
        return module;
      }
    });
    
    // Instance Methods
    _.extend(Module.prototype, Node.prototype, {
      getDependencies : function() {
        return this._dependencies.slice(0);
      }
    });
   
    return Module;
  }
};
