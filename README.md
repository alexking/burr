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

Burr allows you to use Javascript's prototype/new pattern with a nicer syntax. 

	class Apple {
	
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

Note that `class` was `collection` as of `0.0.3` - while `class` isn't completely accurate either, it better suggests that you are creating an object that may be instantiated using `new`. `collection` is still supported for now. 

Check out the `examples/test.br` file. Keep in mind this is alpha alpha.

<<<<<<< HEAD
#### Latest Changelog `0.0.5`
Converting CLI from [commander](https://npmjs.org/package/commander) to [optimist](https://npmjs.org/package/optimist), adding support for `burr file.br` syntax as an alias of `-f`. 

Read [CHANGELOG.md](CHANGELOG.md) for more.
=======
#### Latest Changelog
### version 0.0.4
* Converting to Burr, now located in `/src/burr/`, exports into `/src/js/`, run `js/grind.js -w burr -d js ` for development. 
* Fixing a bunch of bugs, examples in `test/string.br`. 
* Adding Sublime Text 3 syntax and build files (`/syntax/`). 
* Adding `-d` option to export to directory, allowing directory or file with `-w`.

Read CHANGELOG.md for more.
>>>>>>> 3fae08c571d5ca785f975ad500551818344ea942

#### Thanks
Inspired by object and class pattern ideas from http://book.mixu.net/node/ch6.html.

#### License
MIT License
