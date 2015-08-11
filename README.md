# ng-modelbuilder
An angular factory that helps you define db-style models with validation


## Example
    var myModelForPersons = ModelBuilder.createModel([
    	'prename',
    	'lastname',
    	{
    		r: true,
    		name: 'email',
    		validator: function(mail) {
    			if (mail.indexOf('@')>0) {
    				//could be an email
    				return true;
    			}
    
    			return false;
    		}
    	}
    ], 'myPersonModel');
    
    
    
    var sample1 = {
    	prename: 'Bat',
    	lastname: 'Man',
    	email: 'test@none.com'
    };
    
    var sample2 = {
    	lastname: 'What',
    	email: 'so@so.com'	
    };
    
    console.log(myModelForPersons.validates(sample1)); //will return true
    console.log(myModelForPersons.validates(sample2); //will return false
