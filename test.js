
// Collection object 
function TestClass() {

	this.cat = "tonks";
	this.funk = "y";

}

TestClass.prototype.test = function(weAreFunky) {

		
		if (weAreFunky) {

			console.log("We are totally very funnky");

		} else {

			console.log("maybe not so funky");

		}
	
};

TestClass.prototype.test2 = function(num) {


		var functions_can_have_variables_too = true;

		console.log("Hi, I'm test " + num);
		console.log("Our cat is " + this.cat);
	
};



// Normal javascript works normally
justsomerandom = "code"; 

function testTime() {
	
}

// Make as many collections as you like
function AnotherFunkyCollection() {


}



// Instantiate and use them
var test = new TestClass(); 

test.test2(1);

test.test(true);
test.test(false);