function Burr() {


}

Burr.prototype.grindFile = function(input, output) {


	var self = this; 
	var fs = require('fs'); 

	fs.readFile(input, function(err, data) {

		if (err) {

			console.error("We couldn't find the file.");

		} else {

			var source = data.toString();
			var javascript = self.grindString(source);

			fs.writeFile(output, javascript);
		}

	});



};

Burr.prototype.grindString = function(source) {


	var brackets = {}; 

	var quotes = false;
	var singleQuotes = false; 
	var regex = false;  
	var comment = false; 
	var blockComment = false; 

	var bracketSet = 0; 
	var bracketLevel = 0; 

	var bracketPairs = []; 
	var bracketPairsOpen = [];

	var output = "";

	// Loop through each character looking for something interesting 
	for (var characterNumber = 0; characterNumber < source.length; characterNumber++) {
		var character = source[characterNumber];
		var previousCharacter = source[characterNumber - 1];
		var nextCharacter = source[characterNumber + 1];

		// Don't look for comments inside strings 
		if (!quotes && !singleQuotes) {

			// Comment Start 
			if (character == '/' && previousCharacter == '/') {
				comment = true; 
				continue; 
			}

			// Comment End
			if (character == "\n") {
				comment = false; 
				continue; 
			}

			// Block comment start 
			if (previousCharacter == "/" && character == "*" ) {
				blockComment = true; 
				continue; 
			}

			if (character == "*" && nextCharacter == "/") {
				blockComment = false; 
				continue; 
			}

		}

		// Don't look for anything inside comments 
		if (!comment && !blockComment) {

			// Keep track of whether we are inside quotes
			if (character == '"' && previousCharacter != '\\' && !singleQuotes) {
				quotes = !quotes;
				continue; 
			}

			if (character == "'" && previousCharacter != "\\" && !quotes) {
				singleQuotes = !singleQuotes;
				continue; 
			}


			// Don't look for anything else inside quotes 
			if (!quotes && !singleQuotes) {

				// Regex 
				if (character == '/' && previousCharacter != '/' && nextCharacter != '/') {
					regex = !regex;
					continue;
				}

			}

		}

		// If we aren't in quotes, we might be able to see a bracket 
		if (!quotes && !regex && !comment && !blockComment) {

			if (character == "{" || character == "}") {
				var reference;

				if (character == "{") {
					bracketLevel++; 
					reference = bracketPairs.push({ 
						level : bracketLevel, 
						start : characterNumber, 
						done : false 
					}) - 1;

					bracketPairsOpen.push(reference);

				}

				if (character == "}") {
					
					reference = bracketPairsOpen.pop();
					
					bracketPairs[reference].done = characterNumber + 1;

					bracketLevel--; 
				}

			}

		}

	}

	var bracketMap = {};

	// List end brackets by start numbers 
	for (var bracketPairNumber in bracketPairs) {
		var bracketPair = bracketPairs[bracketPairNumber];

		bracketMap[ bracketPair.start ] = { 
			end : bracketPair.done,
			level : bracketPair.level
		};

	}

	// Regexes 
	var collectionRegex = /(?:collection|class)\s+(.*?)(\s+mixin\s+(.*?)|)\s+{/g;
	var functionRegex = /function\s+(.*?)\s*\((.*?)\)\s+{/g;
	var variableRegex = /var\s*(.*?);/g;
	var mixinSeperatorRegex = /,\s*/;  

	var collections = [];
	var collectionLastStart = 0;
	var collectionLastEnd = 0;
	// It's important to catch the pieces between collections - collections can only have functions and variables!!! 

	// Look for collections
	while (collectionDefinition = collectionRegex.exec(source)) {

		// Brackets 
		var collectionStart = collectionDefinition.index;
		var startBracket    = ((collectionDefinition[0].length - 1) + collectionStart);
		var collectionBracketInfo = bracketMap[startBracket]; 

		// If we are unable to find a bracket, then we are in quotes 
		if (typeof collectionBracketInfo === "undefined") {
			continue; 
		}

		var endBracket      = bracketMap[startBracket].end;
		var collectionCode  = source.substring(startBracket, endBracket);
			
		var collectionCodeWithoutFunctions = collectionCode; 

		// Load the before text node 
		var beforeCode	    = source.substring(collectionLastEnd, collectionStart);

		collections.push({
			type	  : "text", 
			code	  : beforeCode
		}); 

		collectionLastStart = collectionStart; 
		collectionLastEnd = endBracket; 

		// Load in the collection
		collections.push({
			type	  : "collection", 
			start	  : startBracket,
			end		  : endBracket, 
			code	  : collectionCode,
			name	  : collectionDefinition[1],
			mixins    : ((typeof collectionDefinition[3] !== "undefined") ? collectionDefinition[3].split(mixinSeperatorRegex) : false) ,
			functions : [],
			variables : []
		});

		// Look for collection functions 
		while (functionDefinition = functionRegex.exec(collectionCode)) {
			var functionStartBracket	= ((functionDefinition[0].length - 1) + functionDefinition.index);
			var functionBracketInfo     = bracketMap[startBracket + functionStartBracket];

			// If we were unable to find bracket information, then this bracket was enclosed in quotes 
			if (typeof functionBracketInfo !== "undefined") {

				var functionEndBracket		= functionBracketInfo.end - startBracket;
				var functionCode			= collectionCode.substring(functionStartBracket, functionEndBracket);

				// We're only interesting in level 2 functions
				if (functionBracketInfo.level == 2) { 

					collections[(collections.length - 1)].functions.push({
						start	: functionStartBracket,
						end		: functionEndBracket,
						name	: functionDefinition[1],
						args	: functionDefinition[2],
						code	: functionCode
					});

				}


				collectionCodeWithoutFunctions = collectionCodeWithoutFunctions.replace(functionCode, "");

			}

		}

		// Look for collection variables 
		while (variableDefinition = variableRegex.exec(collectionCodeWithoutFunctions)) {

			collections[(collections.length - 1)].variables.push({
				code : variableDefinition[1],
			});

		}

	}

	// Add the last text node
	var lastCode = source.substring(collectionLastEnd);
		
	collections.push({
		type	  : "text", 
		code	  : lastCode
	}); 

	// Proccess into javascript
	for (var collectionNumber in collections) {

		var collection = collections[collectionNumber];

		if (collection.type == "text") {

			output += collection.code;

		} else if (collection.type == "collection") {

			var function_code = "";
			var constructor_function = null;

			// Functions
			for (var functionNumber in collection.functions) {
				var func = collection.functions[functionNumber];

				// Constructor 
				if (collection.name == func.name) {

					constructor_function = func; 

				} else {

					// Normal function
					function_code += collection.name + ".prototype." + func.name + " = function(" + func.args + ") {\n";

					function_code += func.code.trim().substring(1, func.code.trim().length - 1).unindent();

					function_code += "\n};\n\n";

				}

			}

			// Create the constructer 
			if (constructor_function) {
				output += "function " + collection.name + "(" + constructor_function.args + ") {\n\n";
			} else {
				output += "function " + collection.name + "() {\n\n";
			}

				// Add the variable 
				for (var variableNumber in collection.variables) {
					var variable = collection.variables[variableNumber]; 

					output += "\tthis." + variable.code + ";\n";

				}

				// Add any mixins 
				if (collection.mixins) {

					output += "\tvar t = this;\n";
					
					output += "\t[" + collection.mixins.join(", ")  + "].forEach(function(mixin) {\n";
					output += "\t\tfor (var func in mixin.prototype) {\n";
					output += "\t\t\t" + collection.name + ".prototype[func] = mixin.prototype[func];\n";
					output += "\t\t}\n";

					output += "\t\tvar mixinInstance = new mixin();\n";
					output += "\t\tfor (var prop in mixinInstance) {\n";
					output += "\t\t\tt[prop] = mixinInstance[prop];\n";
					output += "\t\t}\n";
					output += "\t});\n";

				}

				// Add the real constructor if it exists 
				if (constructor_function) {

					output += "\n\t// Construct";
					output += constructor_function.code.trim().substring(1, constructor_function.code.trim().length - 1).unindent();
				}


			output += "\n}\n\n";
			
			output += function_code;
		

		}

	}


	return output;


};



module.exports = new Burr();

// Add some stuff to String. I know, we're evil. 
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
};


String.prototype.indent = function( num )
{
	var text = [];
	var lines = this.split('\n');
    for (var line_i in lines)
	{
		var line = lines[line_i];
		text.push("\t".repeat(num) + line );
    }

    return text.join('\n');

};

String.prototype.unindent = function()
{
	var text = [];
	var lines = this.split('\n');
    for (var line_i in lines)
	{
		var line = lines[line_i];
		text.push( line.replace(/^\t/, "") );
    }

    return text.join('\n');

};

String.prototype.lineNumber = function(  )
{
	var text = [];
	var lines = this.split('\n');
    for (var line_i in lines)
	{
		var line = lines[line_i];
		text.push("   " + line_i + ": " + line );
    }

    return text.join('\n');

};
