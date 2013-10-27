### version 0.0.5
Converting CLI from [commander](https://npmjs.org/package/commander) to [optimist](https://npmjs.org/package/optimist), adding support for `burr file.br` syntax as an alias of `-f`. 

### version 0.0.4
Converting to Burr, now located in `/src/burr/`, exports into `/src/js/`, run `js/grind.js -w burr -d js ` for development. 

Fixing a bunch of bugs, examples in `test/string.br`. 

Adding Sublime Text 3 syntax and build files (`/syntax/`). 

Adding `-d` option to export to directory, allowing directory or file with `-w`.

### version 0.0.3
Fixing a bug where annonymous functions would screw things up. 

### version 0.0.2
Adding constructor support, use a function with the same name as the collection. 

	collection Funky {
		function Funky() {
			// Construct!
		}
	}

### version 0.0.1
Initial version 