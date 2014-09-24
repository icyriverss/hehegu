<?php
    class mssql_class{
        var $version = '';
        var $querynum = 0;
        var $link = null;
        var $total=0;
        var $err = array();
        function connect($serverName,$uid,$pwd,$database,$charset,$is_die = 1){
            //使用sql server身份验证，参数使用数组的形式，一次是用户名，密码，数据库名
            //如果你使用的是windows身份验证，那么可以去掉用户名和密码
            $connectionInfo = array( 'UID'=>$uid,
                'PWD'=>$pwd,
                'Database'=>$database,
                "CharacterSet"=>$charset,
                'ReturnDatesAsStrings'=> true
            );
            $this->link=sqlsrv_connect( $serverName, $connectionInfo);
            
            if( $this->link === false )
            {
                $this->err = sqlsrv_errors();
                if($is_die){
                print_r(sqlsrv_errors());
                echo "服务器出现错误，请联系管理员。";
                die(); 
                }
            }
        }
        function transaction(){
            if ( sqlsrv_begin_transaction( $this->link ) === false ){
                echo "Could not begin transaction.\n";
                die( print_r( sqlsrv_errors(), true ));
            }
            return $this;
        }
        function commit(){
            sqlsrv_commit($this->link);
        }
        function rollback(){
            sqlsrv_rollback($this->link);
        }
        function error() {	//返回上一次数据库操作产生的错误信息
            return sqlsrv_errors();
        }
        function query($sql, $usecache = false,$Scrollable = SQLSRV_CURSOR_FORWARD) {
            if(!($query = sqlsrv_query($this->link,$sql,array(), array( "Scrollable" => $Scrollable )))) {
                if(sqlsrv_errors()){
                    $this->halt(print_r(sqlsrv_errors()), $sql);
					if(SHOW_SQL_ERROR){
                        echo "MSSQL Query Error:  ".print_r(sqlsrv_errors()).' : '.$sql;die();
					}else{
                        echo "MSSQL Query Error";die();
					}
				}
            }
        //echo $sql.'<br>';
            $this->querynum++;
            return $query;
        }
        function num_rows($query) {		//返回结果集中的行数
            return sqlsrv_num_rows($query);
	    }
        //分页查询，返回query
	    function query_page($sql,$perpage,$page){
		    $query=$this->query($sql);
		    $this->total=$this->num_rows($query);
		    if($this->total<1){return $query;}
		    $maxpage=ceil($this->total/$perpage);
		    $page=max(1,min($page,$maxpage));
            $sql = $sql." limit ".(($page-1)*$perpage).",".$perpage;
		    return $this->query($sql);
	    }
        //分页查询 返回所有
        function query_page_all($sql,$perpage,$page){
            $query=$this->query($sql,false,SQLSRV_CURSOR_KEYSET);
		    $this->total=$this->num_rows($query);
            if($this->total<1) return;
		    $maxpage=ceil($this->total/$perpage);
		    $page=max(1,min($page,$maxpage));
            $res = array();
            for($i=0;$i<$perpage;$i++){
                $tmp = sqlsrv_fetch_array($query,SQLSRV_FETCH_ASSOC,SQLSRV_SCROLL_ABSOLUTE,($page-1)*$perpage+$i);
                if(!$tmp) break;
                $res[] = $tmp;
            }
            return $res;
	    }
        function fetch_all($sql,$usecache=false,$time=0)//使用缓存
        {	//直接将数据集转换成数组输出
            if($arr=$this->get_cache($sql,$time)){//直接读取缓存
                return $arr;
            }
            $res = $this->query($sql,$usecache);
            if ($res !== false)
            {
                $arr = array();
                $row = sqlsrv_fetch_array($res,SQLSRV_FETCH_ASSOC);
                if($row) $arr[] = $row;
                while ($row = sqlsrv_fetch_array($res,SQLSRV_FETCH_ASSOC))
                {
                    $arr[] = $row;
                }
                if($usecache) $this->save_cache($sql,$arr);

                return $arr;
            }
            else
            {
                return false;
            }
        }
        function fetch_array($query, $result_type = SQLSRV_FETCH_ASSOC) {
            return sqlsrv_fetch_array($query, $result_type);
        }

        function fetch_first($sql,$usecache = false) {	//直接读取一条记录
            if($arr=$this->get_cache($sql)){//直接读取缓存
                return $arr;
            }
            $res= $this->fetch_array($this->query($sql,$usecache));
            
            if($usecache) $this->save_cache($sql,$res);
            return $res;
        }
        function result_first($sql,$usecache = false){
            if($arr=$this->get_cache($sql)){//直接读取缓存
                foreach($arr as $k=>$v){
                    return $v;
                }
            }
            $res = $this->fetch_first($sql,$usecache);
            if($res){
            foreach($res as $k=>$v){
                return $v;
            }
            }else{
                return null;
            }
        }
        function result($query, $row = 0) {
            $result = sqlsrv_get_field($query, $row);
            return $result;
        }
        function halt($message = '', $sql = '') {
            $file = "error_log/".date("Y").date("m").".log";
            if(file_exists($file)){
                $logFileHandle = fopen($file, "a+");
                flock($logFileHandle,2);
            }else{
                $logFileHandle = fopen($file, "w+");
            }
            fwrite($logFileHandle,  date("Y-m-d H:i:s",time())."\t".$message . "\t" . $sql."\n");
            fclose($logFileHandle);
        }
        function get_cache($sql,$time=0){
            $filename="cache/".md5($sql).".php";//md5文件名
            if(file_exists($filename)){
                $lasttime=@filemtime($filename);
                if(!$lasttime) $lasttime=0;
                if(time()-$lasttime>$time && $time>0) return null;//缓存超时
                require_once ($filename);
                return $array;
            }else{
                return null;
            }
        }
        function save_cache($sql,$arr){
            $filename='cache/'.md5($sql).".php";//md5文件名
            $str='<?php 
            $array=' . var_export($arr,true) . ';
            $sql = '.var_export($sql,true).';
            ?>';
            file_put_contents($filename, $str);
        }
        function get_table_by_sql($sql){
            $arr = split(' ',$sql);
            foreach($arr as $k=>$v){
                if($v=='from'){
                    return $arr[$k+1];
                }
            }
        }
        function createdir($dir)
        {
            if(file_exists($dir) && is_dir($dir)){
            }
            else{
            mkdir ($dir,0777);
            }
        }
    }
?>