<?php
    class mssql2k_class{
        var $version = '';
        var $querynum = 0;
        var $link = null;
        var $total=0;
        function connect($serverName,$uid,$pwd,$database,$charset){
            $serverName = '(local)';
            //ʹ��sql server�����֤������ʹ���������ʽ��һ�����û��������룬���ݿ���
            //�����ʹ�õ���windows�����֤����ô����ȥ���û���������
            $connectionInfo = array( 'UID'=>$uid,
                'PWD'=>$pwd,
                'Database'=>$database,
                "CharacterSet"=>$charset);
            $this->link=sqlsrv_connect( $serverName, $connectionInfo);
            if( $this->link === false )
            {
                print_r(sqlsrv_errors());
                echo "���������ִ�������ϵ����Ա��";
                die();
            }
            
            $this->link=mssql_connect("ʵ�������߷�����IP","�û���","����");
            //��������
            if(!$this->link)
            {
                echo "���ݿ����ӳ�������ϵ����Ա��";
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
        function fetch_all($sql,$usecache=false)//ʹ�û���
        {	//ֱ�ӽ����ݼ�ת�����������
            if($arr=$this->get_cache($sql)){//ֱ�Ӷ�ȡ����
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

        function fetch_first($sql,$usecache = false) {	//ֱ�Ӷ�ȡһ����¼
            if($arr=$this->get_cache($sql)){//ֱ�Ӷ�ȡ����
                return $arr;
            }
            $res= $this->fetch_array($this->query($sql,$usecache));
            
            if($usecache) $this->save_cache($sql,$res);
            return $res;
        }
        function result_first($sql,$usecache = false){
            if($arr=$this->get_cache($sql)){//ֱ�Ӷ�ȡ����
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
            $filename="cache/".md5($sql).".php";//md5�ļ���
            if(file_exists($filename)){
                require_once ($filename);
                return $array;
            }else{
                return null;
            }
        }
        function save_cache($sql,$arr){
            $filename='cache/'.md5($sql).".php";//md5�ļ���
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