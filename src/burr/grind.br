#!/usr/bin/env node
var program = require('commander');
var chokidar = require('chokidar');
var colors = require('colors');

var burr = require('./burr');
var file = require('./file');

program
  .version('0.0.4')
  .option('-f, --file <path>', 'Input file')
  .option('-o, --output [path]', 'Output file (requires input file)')
  .option('-w, --watch [dir]', 'Watch a file or directory')
  .option('-d, --directory [dir]', 'Output to a different directory')
  .parse(process.argv);

// If we have a file 
if (program.file) {

	var output = '';
	if (program.output) {
		output = program.output; 
	} else {
		var burrFile = new file(program.file);
		output = burrFile.javascript();
	}

	var input  = program.file;
	
	burr.grindFile(input, output);
	
	console.log("Grinding %s to %s", input, output);

}

// If we are watching 
if (program.watch) {

	// Default to the current directory 
	if (program.watch === true) {
		program.watch = ".";
	}

	console.log("Watching " + program.watch);
		
	var watcher = chokidar.watch('./' + program.watch, {persistent: true, ignored: /\.js$/ });

	watcher.on('change', function(input) {

		var burrFile = new file(input); 

		if (program.directory) {
			burrFile.setDirectory(program.directory);
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