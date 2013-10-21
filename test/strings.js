function Strings() {


}

Strings.prototype.stringThatLooksLikeAnonymousFunc = function() {

	var test = "function () {";

};

Strings.prototype.stringThatLooksLikeAFunc = function(frank) {

	var test = "function test() {";

};

Strings.prototype.stringThatLooksLikeACollection = function() {


	var test = "collection NotReal { ";


};

Strings.prototype.regexThatLooksLikeAFunc = function() {


	var test = /function test() {/g;

};

Strings.prototype.singleQuotes = function() {


	var t = '"';


};

Strings.prototype.doubleQuotes = function() {


	var t = "'";


};

Strings.prototype.slashInSingleQuotes = function() {


	var t = '/';


};

Strings.prototype.slashInDoubleQuotes = function() {


	var t = "/";


};

Strings.prototype.slashInComment = function() {

	// /

};

Strings.prototype.blockComment = function() {

	/*  */

};

Strings.prototype.slashInBlockComment = function() {

	/* / */

};

Strings.prototype.singleQuoteInComment = function() {

	// '

};

Strings.prototype.singleQuoteInBlockComment = function() {

	/* ' */

};

Strings.prototype.doubleQuoteInComment = function() {

	// "

};

Strings.prototype.doubleQuoteInBlockComment = function() {

	/* " */

};

Strings.prototype.hu = function() {

	var output = "// Construct";

};

Strings.prototype.wonkyRegex = function() {

	var pathInfo = path.match(/a\/g/);

};

Strings.prototype.other = function() {

	var test = '\\';

};

Strings.prototype.bracketInsideStringInsideLoop = function() {


	var output = '\n';
	

};



function stringThatLooksLikeACollectionOutside() {

	var test = "collection NotReal { ";

}