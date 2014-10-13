//Contains helper functions
var helper = {
	inArray: function (needle, haystack){
		var length = haystack.length;
		for(var i = 0; i<length; i++){
			if(haystack[i] == needle) return true;
		}
		return false;
	},
	genUniqueTextId: function (textList){
		textId = Math.random().toString(36).replace(/[^a-z0-9]+/g,'').substr(0,7)	
		if(this.inArray(textId, textList)){
			this.genUniqueTextId();
		}
		return textId;
	},
	inObjectArray: function(needle, haystack, obj_key){
		var length = haystack.length;
		for(var i =0; i<length; i++){
			if(haystack[i][obj_key]==needle) return haystack[i];
		}
		return false;
	},
	checkEmptyObjectKeys: function(object){
		//Iterate through object and check if they have empty keys.
		for(var prop in object){
			if(object.hasOwnProperty(prop)){
				if(object[prop]=="" || object[prop]==false){
					
				}
			}
		}

	}
};

module.exports = helper;