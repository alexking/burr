Burr
====

Burr is a Javascript superset that embraces the prototype model while beautifying the syntax (and compiles to plain JS). 

#### Try it out 

Install using NPM - 

	npm install burr -g 
	
Process .br files using - 

	burr -f test.br
	
This will create test.js. 

You can also watch a directory and process any non-js files using 

	cd dir
	burr -w

#### Syntax 

Burr is based around using collections to organize objects using a nicer syntax. 

	collection Apple {
	
		var chomps = 0;
	
		function chomp() {
			this.chomps++;
		}
	
	}

	var apple = new Apple();
	apple.chomp();
	apple.chomp();
	console.log("%s chomps", apple.chomps);

This would compile into this Javascript object - 

	function Apple() {
		this.chomps = 0;
	}
	
	Apple.prototype.chomp = function() {
		this.chomps++;
	};
	
	var apple = new Apple();
	apple.chomp();
	apple.chomp();
	console.log("%s chomps", apple.chomps);

Which of course outputs `2 chomps`. 

Check out the `examples/test.br` file. Keep in mind this is alpha alpha.

#### Latest Changelog
### version 0.0.4
Converting to Burr, now located in `/src/burr/`, exports into `/src/js/`, run `js/grind.js -w burr -d js ` for development. 

Fixing a bunch of bugs, examples in `test/string.br`. 

Adding Sublime Text 3 syntax and build files (`/syntax/`). 

Adding `-d` option to export to directory, allowing directory or file with `-w`.

Read CHANGELOG.md for more.

#### Thanks
Inspired by object and class pattern ideas from http://book.mixu.net/node/ch6.html.

#### License
MIT License
