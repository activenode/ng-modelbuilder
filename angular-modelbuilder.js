angular.factory('ModelBuilder', {
  ModelBuilderHelper: function($log) {
    return {
      createModel: function(modelDefinitions, optnNaming) {
        var _modelDefinitions = angular.copy(modelDefinitions);
        $log.debug('Creating a validator ' + (optnNaming ? '(`' + optnNaming + '`)' : '') + ' with following definitions', modelDefinitions);

        for (k in _modelDefinitions) {
          if (typeof _modelDefinitions[k] == 'string') {
            _modelDefinitions[k] = {
              'r': true,
              'name': _modelDefinitions[k]
            };
          }

          if (!angular.isObject(_modelDefinitions[k]) || Array.isArray(_modelDefinitions[k])) {
            //error > is no object
            $log.error('The given value in your definitions-array is neither a string nor an object (arrays not accepted)! Cannot validate this definition!', _modelDefinitions[k]);
            throw 'Killing operation of create() because of previous error.';
          } else {
            if ((typeof _modelDefinitions[k]['name'] !== 'string')) {
              $log.error('A name (column-key) must be provided with each definition!');
              throw 'No column-key provided. Exiting operation...';
            }

            //is real object (no array), check for r and name

            _modelDefinitions[k].r = (typeof _modelDefinitions[k]['r'] == 'undefined') || !!_modelDefinitions[k]['r'];
            _modelDefinitions[k]._validates = function(objToValidate) {
              var objColType;
              try {
                objColType = typeof objToValidate[this.name];
              } catch (e) {};

              var bValidates = ((objColType == 'undefined' || !objToValidate[this.name]) && !this.r) ||
                (objColType != 'undefined' && this.r);

              if (this.validator) {
                //code
                return bValidates && this.validator(objToValidate[this.name]);
              }

              return bValidates;
            };
          }
        }

        return {
          mapper: function(o) {
            return o
          },
          validates: function(obj) {
            var objCopy = this.mapper(angular.copy(obj));

            for (k in _modelDefinitions) {
              //at this point it is already ensured that every definition looks as follows:
              // {'r': bool required?, 'name': string columnkey, 'rx': RegExp to check, validate: Function}

              if (!_modelDefinitions[k]._validates(obj)) {
                $log.debug('Object was not successfully validated because the column `' + _modelDefinitions[k].name + '` did not validate', obj);
                return false;
              }
            }

            return objCopy;
          },

          //addMapper will add a mapping action so that before validation mapping happens!
          addMapper: function(mapperFunc) {
            if (typeof mapper !== 'function') {
              $log.error('addMapper() needs a function as parameter!');
            } else {
              this.mapper = mapperFunc;
            }

            return this;
          }
        };
      }
    };
  }
});
