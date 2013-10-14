
// Collection object 
// You can mixin other collections as well using mixin 
function TestClass() {

	this.cat = "tonks";
	var t = this;
	[Funky, Fresh].forEach(function(mixin) {
		for (var func in mixin.prototype) {
			TestClass.prototype[func] = mixin.prototype[func];
		}
		var mixinInstance = new mixin();
		for (var prop in mixinInstance) {
			t[prop] = mixinInstance[prop];
		}
	});

}

TestClass.prototype.test = function() {

	
	// You can use functions from mixins 
	if (this.funk()) {

		console.log("We are totally very funky");

	} else {

		console.log("maybe not so funky");

	}

};

TestClass.prototype.test2 = function(num) {


	var functions_can_have_variables_too = true;

	console.log("Hi, I'm test " + num);
	console.log("Our cat is " + this.cat);
	console.log("Is it fresh? " + (this.isFresh() ? "Yes" : "No") );

};

TestClass.prototype.isFresh = function() {

	return test.freshness > 2;

};



// Collections to mix in
function Funky() {


}

Funky.prototype.funk = function() {

	return true; 

};



function Fresh() {

	this.freshness = 5;

}



// Normal javascript works normally
justsomerandom = "code"; 

function testTime() {
	
}

// Instantiate and use!
var test = new TestClass(); 

test.test2(1);
test.test();

