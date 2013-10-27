#!/usr/bin/env node
var chokidar = require('chokidar');
var colors = require('colors');

var burr = require('./burr');
var file = require('./file');

var optimist = require('optimist');

var argv = optimist.usage('\nConvert Burr files to plain Javascript \n\nUsage: $0')
	.string('f')
	.alias('f', 'file')
	.describe('f', 'Input Burr file')
	.alias('o', 'output')
	.describe('o', 'Output JS file')
	.alias('w', 'watch')
	.describe('w', 'Watch a file or directory')
	.alias('d', 'directory')
	.describe('d', 'Output to a different directory')
	.alias('h', 'help')
	.describe('h', 'Shows this message')
	.argv;

// Input file 
var inputFile; 

// --file
if (argv.file && argv.file !== true) {

	inputFile = argv.file; 

// Last argument 
} else if (argv._.length) {

	inputFile = argv._[0]; 

} 

// If we have a file 
if (inputFile) {

	var output = '';
	if (argv.output && argv.output !== true) {
		output = argv.output; 
	} else {
		var burrFile = new file(inputFile);
		output = burrFile.javascript();
	}

	var input  = inputFile;
	
	burr.grindFile(input, output);
	
	console.log("Grinding %s to %s", input, output);

} 

// If we are watching 
if (argv.watch) {

	// Default to the current directory 
	if (argv.watch === true) {
		argv.watch = ".";
	}

	console.log("Watching " + argv.watch);
		
	var watcher = chokidar.watch('./' + argv.watch, {persistent: true, ignored: /\.js$/ });

	watcher.on('change', function(input) {

		var burrFile = new file(input); 

		if (argv.directory) {
			burrFile.setDirectory(argv.directory);
		}

		// Only process burr/br files 
		if (burrFile.isBurrFile()) {
			var output = burrFile.javascript(); 

			console.log('Grinding ', input, ' to ', output);
			burr.grindFile(input, output);
		
		}

	});

	watcher.close();

}

// If we didn't get --file, --watch, we should probably show the help
// They could also just ask for it 
if ((!inputFile && !argv.watch) || argv.help) {

	optimist.showHelp();

}