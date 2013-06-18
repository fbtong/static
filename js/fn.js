/**
 * jquery 获取表单的值
 */
$("form").serialize();

/**
 * javascript arguments参数
 * 
 */

//eg: 通过arguments获取一个函数的实际参数和预定义参数 
function argumentsGet(a, b, c, d) {
	var argNums = arguments.length;
	var fnNums = argumentsGet.length;
	
	console.log(argNums, argNums[0], fnNums, fnNums[0]);
}

/**
 * javascript arguments.callee
 */
function calleeObject(){
	console.log(arguments.callee);
}
calleeObject();
function create(){
	return function(n){
		if(n <= 1)
			return 1;
		return n * arguments.callee(n-1);
	}
}
var result = create()(5);
[1,2,3,4,5].map(function(n){
    return !(n > 1)? 1 : arguments.callee(n-1)*n;
})