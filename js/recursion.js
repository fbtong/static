/*
 * 递归例子
 */
var array = [{
  name: '浙江省',
  leaf: 1,
  children: [{
    name: '杭州市',
    leaf: 1,
    children: [{
      name: '西湖区',
      leaf: 0,
      children: null
    },
    {
      name: '萧山区',
      leaf: 0,
      children: ''
    }]
  },
  {
    name: '温州市',
    leaf: 1,
    children: [{
      name: '乐清市',
      leaf: 0,
      children: null
    },
    {
      name: '苍南县',
      leaf: 0,
      children: ''
    }]
  }]
}];
function getReionByRegionName(name, array) {
  var result = null;
  for (var i = 0; i < array.length; i++) {
    if (name == array[i].name) {
      result = array[i];
      break;
    } else if (array[i].children != null && array[i].children != '') {
      result = getReionByRegionName(name, array[i].children);
      if (result != null) break;
    }
  }
  return result;
}
//console.log是firebug, Ext.encode是exjs的,我只是为了输出验证,你改为自己的.
console.log(Ext.encode(array));
console.log(Ext.encode(getReionByRegionName('浙江省', array)));
console.log(Ext.encode(getReionByRegionName('杭州市', array)));
console.log(Ext.encode(getReionByRegionName('西湖区', array)));
console.log(Ext.encode(getReionByRegionName('萧山区', array)));
console.log(Ext.encode(getReionByRegionName('温州市', array)));
console.log(Ext.encode(getReionByRegionName('乐清市', array)));
console.log(Ext.encode(getReionByRegionName('苍南县', array)));

function fact(num){
	if (num<=1){
		return 1;
	}else{
		return num*fact(num-1);
	}
}