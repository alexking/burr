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

Burr also supports mixins in function definitions. 

Check out the `test.br` file. Keep in mind this is alpha alpha.

#### Latest Changelog
**0.0.3** - Fixing a bug where annonymous functions would screw things up. 

Read CHANGELOG.md for more.

#### Thanks
Inspired by object and class pattern ideas from http://book.mixu.net/node/ch6.html.

#### License
MIT License
