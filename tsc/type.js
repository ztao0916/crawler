//any:任意类型
var obj = { a: 1 };
//无: 数组类型
var arr = [1, 2];
var arr1 = [1, 2];
//number: 双精度浮点值
var num = 1;
//string: 字符串类型
var str = 'str';
//boolean: 布尔型
var flag = true;
//元组类型用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型需要相同
var x = ['Runoob', 1];
//x = [1, 'Runoob']    // 报错
//enum: 枚举类型
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Blue;
console.log(c);
//void: 标识返回值的类型,该方法没有返回值
function hello() {
    alert('hello runoob');
}
//类型断言: 改变类型 <类型>值  或者 值 as 类型
var str = '1';
var str2 = str; //str、str2 是 string 类型
console.log(str2);
/**
 * 变量作用域问题: 全局作用域 类作用域 局部作用域
 */
var global_num = 12; //全局变量
var Numbers = /** @class */ (function () {
    function Numbers() {
        this.num_val = 13; //实例变量(实例化访问)
    }
    Numbers.prototype.storeNum = function () {
        var local_num = 14; //局部变量
        console.log('局部变量为:', local_num);
    };
    Numbers.sval = 10; //静态变量(可以通过类属性名的方式直接访问)
    return Numbers;
}());
console.log('全局变量为:', global_num);
console.log('静态变量为:', Numbers.sval);
var numbers = new Numbers();
console.log('实例变量为:', numbers.num_val);
numbers.storeNum();
