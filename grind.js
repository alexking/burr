#!/usr/bin/env node


var program = require('commander');
var fs = require('fs');
var chokidar = require('chokidar');


program
  .version('0.0.2')
  .option('-f, --file <path>', 'Input file')
  .option('-w, --watch [dir]', 'Watch')
  .parse(process.argv);

if (program.file) {

	var output = program.file.replace('.br', '.js');
	var input  = program.file;
	
	proccessFile(input, output);
	
	console.log("Writing %s to %s", input, output);

} 

if (program.watch) {

	console.log("Watchin' .");
		
	var watcher = chokidar.watch('./', {persistent: true, ignored: /\.js$/ });

	watcher
	  .on('change', function(path) {


		var output = path.replace('.br', '.js');
		var input  = path;

		console.log('Grinding ', input, ' to ', output);
		proccessFile(input, output);

	  });

}

function proccessFile(input, output) {
	
	fs.readFile(input, function(err, data) {

		if (err) {

			console.error("We couldn't find the file.");

		} else {

			var source = data.toString();
			var javascript = grind(source);

			fs.writeFile(output, javascript);
		}

	});

}

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

function grind(source) {

	// 1. Look for brackets that aren't part of strings 
	// 2. Find their partner
	// 3. Keep a list of bracket + partner locations

	// 4. Find the bracket definitions that we're interested in, down from collection > function | variable 
	// 5. Create an array of plain, collection, collection function, and collection variable 
	// 6. Reconstitute with a join 

	var brackets = {}; 

	var quotes = false; 
	var bracketSet = 0; 
	var bracketLevel = 0; 

	var bracketPairs = []; 
	var bracketPairsOpen = [];

	var output = "";

	// Loop through each character looking for something interesting 
	for (var characterNumber = 0; characterNumber < source.length; characterNumber++) {
		var character = source[characterNumber];
		var previousCharacter = source[characterNumber - 1];

		// Keep track of whether we are inside quotes
		if (character == '"' && previousCharacter != '\\') {
			quotes = !quotes;
			continue; 
		}

		// @TODO regex, comment, etc. 

		// If we aren't in quotes, we might be able to see a bracket 
		if (!quotes) {

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

		bracketMap[ bracketPair.start ] = bracketPair.done; 

	}

	// Regexes 
	var collectionRegex = /collection\s+(.*?)(\s+mixin\s+(.*?)|)\s+{/g;
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
		var endBracket      = bracketMap[startBracket];
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
			var functionEndBracket		= bracketMap[startBracket + functionStartBracket] - startBracket;
			var functionCode			= collectionCode.substring(functionStartBracket, functionEndBracket);

			collections[(collections.length - 1)].functions.push({
				start	: functionStartBracket,
				end		: functionEndBracket,
				name	: functionDefinition[1],
				args	: functionDefinition[2],
				code	: functionCode
			});


			collectionCodeWithoutFunctions = collectionCodeWithoutFunctions.replace(functionCode, "");


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

}
