function BurrFile(fileString) {

	this.name;
	this.directory;
	this.ext;

	// Construct
	this.setFile(fileString);

}

BurrFile.prototype.setFile = function(fileString) {

	var path = require('path');

	this.ext       = path.extname(fileString);
	this.file      = path.basename(fileString, this.ext); 
	this.directory = path.dirname(fileString);


};

BurrFile.prototype.setDirectory = function(directory) {

	this.directory = directory; 

};

BurrFile.prototype.isBurrFile = function() {

	return (this.ext == ".burr" || this.ext == ".br"); 

};

BurrFile.prototype.javascript = function() {


	// Replace 
	return this.directory + "/" + this.file + ".js";


};



module.exports = BurrFile; 