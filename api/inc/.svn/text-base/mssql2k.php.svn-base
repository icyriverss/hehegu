<?php
    class mssql2k_class{
        var $version = '';
        var $querynum = 0;
        var $link = null;
        var $total=0;
        function connect($serverName,$uid,$pwd,$database,$charset){
            $serverName = '(local)';
            //使用sql server身份验证，参数使用数组的形式，一次是用户名，密码，数据库名
            //如果你使用的是windows身份验证，那么可以去掉用户名和密码
            $connectionInfo = array( 'UID'=>$uid,
                'PWD'=>$pwd,
                'Database'=>$database,
                "CharacterSet"=>$charset);
            $this->link=sqlsrv_connect( $serverName, $connectionInfo);
            if( $this->link === false )
            {
                print_r(sqlsrv_errors());
                echo "服务器出现错误，请联系管理员。";
                die();
            }
            
            $this->link=mssql_connect("实例名或者服务器IP","用户名","密码");
            //测试连接
            if(!$this->link)
            {
                echo "数据库连接出错，请联系管理员。";
                die();
            }
            mssql_select_db("dbname");
        }
        function query($sql, $usecache = false) {
            if(!($query = sqlsrv_query($this->link,$sql))) {
                if(sqlsrv_errors()){
                    $this->halt(print_r(sqlsrv_errors()), $sql);
					if(SHOW_SQL_ERROR){
                        echo "MSSQL Query Error:  ".print_r(sqlsrv_errors()).' : '.$sql;die();
					}else{
                        echo "MSSQL Query Error";die();
					}
				}
            }
            $this->querynum++;
            return $query;
        }
        function fetch_all($sql,$usecache=false)//使用缓存
        {	//直接将数据集转换成数组输出
            if($arr=$this->get_cache($sql)){//直接读取缓存
                return $arr;
            }
            $res = $this->query($sql,$usecache);
            if ($res !== false)
            {
                $arr = array();
                while ($row = sqlsrv_fetch_array($res))
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
            foreach($res as $k=>$v){
                return $v;
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
        function get_cache($sql){
            $filename="cache/".md5($sql).".php";//md5文件名
            if(file_exists($filename)){
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