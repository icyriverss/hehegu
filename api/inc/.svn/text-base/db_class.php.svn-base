<?php

class db_class
{	//数据库连接类
	var $version = '';
	var $querynum = 0;
	var $link = null;
	var $total=0;
	function connect($dbhost, $dbuser, $dbpw, $dbname = '', $pconnect = 0, $halt = TRUE, $dbcharset2 = '') {

		$func = empty($pconnect) ? 'mysql_connect' : 'mysql_pconnect';
		if(!$this->link = @$func($dbhost, $dbuser, $dbpw, 1)) {
			$halt && $this->halt('Can not connect to MySQL server');
		} else {
			if($this->version() > '4.1') {
				global $charset, $dbcharset;
				$dbcharset = $dbcharset2 ? $dbcharset2 : $dbcharset;
				$dbcharset = !$dbcharset && in_array(strtolower($charset), array('gbk', 'big5', 'utf-8')) ? str_replace('-', '', $charset) : $dbcharset;
				$serverset = $dbcharset ? 'character_set_connection='.$dbcharset.', character_set_results='.$dbcharset.', character_set_client=binary' : '';
				$serverset .= $this->version() > '5.0.1' ? ((empty($serverset) ? '' : ',').'sql_mode=\'\'') : '';

				$serverset && mysql_query("SET $serverset", $this->link);
			}
			$dbname && @mysql_select_db($dbname, $this->link);
		}

	}

	function select_db($dbname) {
		return mysql_select_db($dbname, $this->link);
	}

	function fetch_array($query, $result_type = MYSQL_ASSOC) {
		return mysql_fetch_array($query, $result_type);
	}

	function fetch_first($sql) {	//直接读取一条记录
		return $this->fetch_array($this->query($sql));
	}

    function fetch_all($sql)
    {	//直接将数据集转换成数组输出
        $res = $this->query($sql);
        if ($res !== false)
        {
            $arr = array();
            while ($row = mysql_fetch_assoc($res))
            {
                $arr[] = $row;
            }

            return $arr;
        }
        else
        {
            return false;
        }
    }
	//分页查询，返回query
	function query_page($sql,$perpage,$page){
		$query=$this->query($sql);
		$this->total=$this->num_rows($query);
		if($this->total<1){return $query;}
		$maxpage=ceil($this->total/$perpage);
		$page=max(1,min($page,$maxpage));
		return $this->query($sql." limit ".(($page-1)*$perpage).",".$perpage);
	}
	//根据query直接返回数组
	function get_array($query){
		$res=array();
		while($result=$this->fetch_array($query)){
			$res[]=$result;
		}
		return $res;
	}
	
    function fetch_page($s,$t,$n,$p)
    {	//分页形式的记录
		$nums = max(1,$n);
		$page = max(min($p,ceil($t/$nums)),1);
		$begin = ($page-1)*$nums;
		$sql = $s." limit ".$begin.",".$nums."";
		return $this->fetch_all($sql);
    }	

	function result_first($sql) {	//返回一条记录的一个字段
		return $this->result($this->query($sql), 0);
	}

	function query($sql, $type = '') {
		
		$func = $type == 'UNBUFFERED' && @function_exists('mysql_unbuffered_query') ?'mysql_unbuffered_query' : 'mysql_query';
		if(!($query = $func($sql, $this->link))) {
			if(mysql_error()){
				$this->halt(mysql_errno()." ： ".mysql_error(), $sql);
					if(SHOW_SQL_ERROR){
					echo "MySQL Query Error:  ".mysql_error().' : '.$sql;die();
					}else{
					echo "MySQL Query Error";die();	
					}
				}
		}

		$this->querynum++;
		return $query;
	}

	function affected_rows() {	//返回上一次数据库操作所影响的记录条数
		return mysql_affected_rows($this->link);
	}

	function error() {	//返回上一次数据库操作产生的错误信息
		return (($this->link) ? mysql_error($this->link) : mysql_error());
	}

	function errno() {	//返回上一次数据库操作产生的错误信息编码，没错则返回0
		return intval(($this->link) ? mysql_errno($this->link) : mysql_errno());
	}

	function result($query, $row = 0) {
		$query = @mysql_result($query, $row);
		return $query;
	}

	function num_rows($query) {		//返回结果集中的行数
		$query = mysql_num_rows($query);
		return $query;
	}

	function num_fields($query) {	//返回结果集中的字段数
		return mysql_num_fields($query);
	}

	function free_result($query) {	//释放内存
		return mysql_free_result($query);
	}

	function insert_id() {	//查询上一步操作生成的ID
		return ($id = mysql_insert_id($this->link)) >= 0 ? $id : $this->result($this->query("SELECT last_insert_id()"), 0);
	}

	function fetch_row($query) {
		$query = mysql_fetch_row($query);
		return $query;
	}

	function fetch_fields($query) {
		return mysql_fetch_field($query);
	}

	function version() {
		if(empty($this->version)) {
			$this->version = mysql_get_server_info($this->link);
		}
		return $this->version;
	}

	function close() {
		return mysql_close($this->link);
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
}
?>