
function Fruit() {

	this.chomps = 0;

}

Fruit.prototype.chomp = function() {

	this.chomps++;

};



function Apple() {

	var t = this;
	[Fruit].forEach(function(mixin) {
		for (var func in mixin.prototype) {
			Apple.prototype[func] = mixin.prototype[func];
		}
		var mixinInstance = new mixin();
		for (var prop in mixinInstance) {
			t[prop] = mixinInstance[prop];
		}
	});

}



var apple = new Apple();
apple.chomp();
apple.chomp();
console.log("%s chomps", apple.chomps);