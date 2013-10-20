
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