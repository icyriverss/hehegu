var loadlist =[
'moudle/my.js',
'moudle/notice.js',
'moudle/table.js',
'moudle/menu.js',
'moudle/view.js',
'moudle/util.js',
'moudle/user.js',
'moudle/goods.js',
'moudle/persons.js',
'moudle/querypage.js',
'moudle/user_level.js',
'moudle/chejian.js', 
'moudle/shuidian.js',
'moudle/order.js',
'moudle/node.js',
'moudle/node_menu.js',
'moudle/node_child.js',
'moudle/node_data.js',
'moudle/node_do.js',
'moudle/node_rs.js',
'moudle/zhiwei.js',
'moudle/node.js',
'control/init.js'
];
for(var i=0;i<loadlist.length;i++){
	var filename = loadlist[i];
	document.write('<script type="text/javascript" src="'+filename+'?ver='+version+'"><\/script>');
}
document.write('<link href="images/css.css?ver='+version+'" media="screen" rel="stylesheet" type="text/css" />');
