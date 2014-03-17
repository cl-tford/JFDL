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
    };
    
    // Class Methods
    _.extend(Module, Node, {
      getById : function(id) {
        var module = getModuleById(id);
        
        if (!module) {
//          module = require('./' + id.toLowerCase() + '.js');
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
