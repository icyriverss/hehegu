<?php

//检测email格式
function chkemail($email) {
    return strlen($email) > 6 && preg_match("/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/", $email);
}

//防注入&XSS
function parsepoststr($str) {
    return get_magic_quotes_gpc() ? htmlspecialchars(mysql_real_escape_string(stripslashes($str))) : htmlspecialchars(mysql_real_escape_string($str));
}

//获取本期的日期范围
function getCurrentDay($year, $month) {
    $nday = date('t', strtotime("$year-$month-1"));
    $today = date('Y-m-d', time() - 24 * 3600); //benri
    if (strtotime("$year-$month-$nday") >= strtotime($today)) {//下一个日期大于$today
        $nday = date('d', strtotime($today));
    }
    return "$year-$month-$nday";
}

//获取某月的上期日期
function getPreDay($year, $month) {
    $nday = date('t', strtotime("$year-$month-1")); //本期最后一日
    $today = date('Y-m-d', time() - 24 * 3600); //本日
    if (strtotime("$year-$month-$nday") >= strtotime($today)) {//下一个日期大于$today
        $nday = date('d', strtotime($today));
    }
    $pyear = $year;
    $pmonth = $month - 1;
    $pday = $nday;
    if ($month == 1) {
        $pyear--;
        $pmonth = 12;
    }
    $pdays = date('t', strtotime("$pyear-$pmonth-1")); //获取上期天数

    if ($pday > $pdays) {
        $pday = $pdays;
    }
    return array(
        "start" => "$pyear-$pmonth-01",
        "end" => "$pyear-$pmonth-$pday");
}

//获取某月的同期
function getSameDay($year, $month) {
    $syear = $year - 1;
    $sday = date('t', strtotime("$nyear-$month-01"));

    $nday = date('t', strtotime("$year-$month-1")); //本期最后一日
    $today = date('Y-m-d', time() - 24 * 3600); //本日
    if (strtotime("$year-$month-$nday") >= strtotime($today)) {//下一个日期大于$today
        $nday = date('d', strtotime($today));
    }
    if ($sday > $nday)
        $sday = $nday;

    return array(
        "start" => "$syear-$month-01",
        "end" => "$syear-$month-$sday");
}

//中英文下划线
function check_str($str) {
    if (preg_match("/^[\x{4e00}-\x{9fa5}A-Za-z0-9_]+$/u", $str)) {
        return true;
    }
    return false;
}

function getExcelTag($col) {
    $head = 0;
    $head = floor($col / 26);
    if ($head > 0) {
        return chr(64 + $head) . chr(65 + $col % 26);
    } else {
        return chr(65 + $col);
    }
}

/**
 * 上传EXCEL
 * 返回数组
 * $filePath 临时存放路径
 * $file $_FILES信息
 */
function uploadExcel($file) {
    require_once '../phpexcel/PHPExcel.php';
    require_once '../phpexcel/PHPExcel/IOFactory.php';
    require_once '../phpexcel/PHPExcel/Reader/Excel5.php';
    require_once '../phpexcel/PHPExcel/Reader/Excel2007.php';
    $filename = $file['name'];
    $filetempname = $file['tmp_name'];
    //获取上传文件的扩展名
    $extend = strrchr($filename, '.');
    $name = time() . $extend;
    $uploadfile = $filePath . $name; //上传后的文件名地址 
//    $result = move_uploaded_file($filetempname, $uploadfile); //假如上传到当前目录下
//    if (!$result) {
//        exit('文件上传失败');
//    }
    $extend == 'xlsx' ? $reader_type = 'Excel2007' : $reader_type = 'Excel5';
    $objReader = PHPExcel_IOFactory::createReader($reader_type); //use excel2007 for 2007 format 
    if (!$objReader) {
        exit('excel文件不兼容');
    }
    $objPHPExcel = $objReader->load($filetempname);
    $sheet = $objPHPExcel->getSheet(0);
    $highestRow = $sheet->getHighestRow();           //取得总行数 
    $highestColumn = $sheet->getHighestColumn(); //取得总列数
    $objWorksheet = $objPHPExcel->getActiveSheet();
    $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn); //转换总列数
    $arr = array();
    for ($row = 1; $row <= $highestRow; $row++) {
        for ($col = 0; $col < $highestColumnIndex; $col++) {
            $arr[$row][$col] = $objWorksheet->getCellByColumnAndRow($col, $row)->getValue();
        }
    }
    return $arr;
}

function saveasexcel($array, $filename, $title) {
    require_once '../phpexcel/PHPExcel.php';
    $objPHPExcel = new PHPExcel();
    $objPHPExcel->getProperties()->setCreator("Y")
            ->setLastModifiedBy("Y");
    $row = 0;
    $objPHPExcel->setActiveSheetIndex(0);
    $objActSheet = $objPHPExcel->getActiveSheet();
    $objActSheet->getDefaultRowDimension()->setRowHeight(30);
    $objActSheet->setTitle($title);

    $merge = array(); //合并记录数组
    foreach ($array as $key => $tr) {
        $col = 0;
        foreach ($tr as $k => $td) {
            $tag = getExcelTag($col);
            while ($merge[$tag][$row] == 1) {
                $col++;
                $tag = getExcelTag($col);
            }
            //设置宽度
            if ($td['width'] && $td['colspan'] == 1)
                $objActSheet->getColumnDimension($tag)->setWidth($td['width'] * 1.2 / 10); //非合并后的单元格可以设置宽度

                
//设置内容
            $objActSheet->setCellValue($tag . ($row + 1), $td['html']);
            $array[$key][$k]['t'] = $tag . ($row + 1);
            //合并单元格
            if ($td['rowspan'] > 1) {//行合并
                $objActSheet->mergeCells($tag . ($row + 1) . ':' . $tag . ($row + $td['rowspan']));
                if (!$merge[$tag])
                    $merge[$tag] = array();
                for ($i = 0; $i < $td['rowspan'] - 1; $i++) {
                    for ($j = 0; $j < $td['colspan']; $j++) {
                        //$merge[getExcelTag($col+$j)][$row+$i+1] = 1;//如第0行占据2行，则第一行为被合并行，自动跳过
                        $merge[getExcelTag($col + $j)][$row + $i + 1] = 1;
                        $objActSheet->getStyle(getExcelTag($col + $j) . ($row + $i + 2))->applyFromArray(array(//被合并的单元格单独设置边框
                            'borders' => array(
                                'allborders' => array(
                                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                                    'color' => array(
                                        'rgb' => 'E8E8E8'
                                    )
                                )
                            )
                        ));
                    }
                }
            }
            if ($td['colspan'] > 1) {//列合并
                $objActSheet->mergeCells($tag . ($row + 1) . ':' . getExcelTag($col + $td['colspan'] - 1) . ($row + 1));
                $col = $col + $td['colspan'] - 1;
                //$objCELLStyle = $objActSheet->getStyle($tag.($row+1).':'.getExcelTag($col+$td['colspan']-1).($row+1));
            }

            //设置样式
            $color = $td['bgcolor'];
            $objActSheet->getStyle($tag . ($row + 1))->applyFromArray(
                    array(
                        'alignment' => array(
                            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                        ),
                        'fill' => array(
                            'type' => PHPExcel_Style_Fill::FILL_SOLID,
                            'rotation' => 90,
                            'startcolor' => array(
                                'rgb' => $color
                            ),
                            'endcolor' => array(
                                'rgb' => $color
                            )
                        ),
                        'borders' => array(
                            'allborders' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => 'E8E8E8'
                                )
                            )
                        )
                    )
            );
            $col++;
        }
        $row++;
    }

    $objPHPExcel->setActiveSheetIndex(0);
    header('Content-Type: application/vnd.ms-excel;charset=UTF-8');
    header('Content-Disposition: attachment;filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    $objWriter->save('php://output');
    exit;
}

function showerror($str) {
    ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <HEAD>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <script>
                alert("<?= $str ?>");
                history.go(-1);
            </script>
        </HEAD>
        <body>
        </body>
    </html>
    <?php
    die();
}

function showsucess($str = '', $url = '') {
    ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <HEAD>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        </HEAD>
        <body>
            <script>
                < ? if (!empty($str)){? > alert("<?= $str ?>"); < ? }? >
                        window.location.href = "<?= $url ?>";
            </script>
        </body>
    </html>
    <?php
    die();
}

function float_val($nums) {
    if (is_numeric($nums))
        return floatval($nums);
    return 0;
}

function int_val($nums) {//强制转化正整数
    return abs(intval($nums));
}

function str2int($str) {//过滤数字字符串
    $ret_str = '';
    for ($i = 0; $i < strlen($str);$i++) {
        $ret_str.= is_numeric($str[$i])?$str[$i]:'';
    }
    return $ret_str;
}

function int_array($arr_nums) {//强制转换逗号分割的数字字符串
    $ret_arr = array();
    $arr = explode(",", $arr_nums);
    for ($i = 0; $i < count($arr); $i++) {
        $ret_arr[] = int_val($arr[$i]);
    }
    return $ret_arr;
}

///获取客户端ip，
function _get_client_ip() {
    $clientip = '';
    ///环境变量客户端ip有值且字符长度大于unknown，则说明该变量有效，确定为客户端ip
    if (getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')) {
        $clientip = getenv('HTTP_CLIENT_IP');
        ///否则取当前浏览用户的网关ip地址
    } elseif (getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')) {
        $clientip = getenv('HTTP_X_FORWARDED_FOR');
        ///用户计算机的ip地址
    } elseif (getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')) {
        $clientip = getenv('REMOTE_ADDR');
    } elseif (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')) {
        $clientip = $_SERVER['REMOTE_ADDR'];
    }

    ///判断是否是数字与点组成的7-15位字符
    preg_match("/[\d\.]{7,15}/", $clientip, $clientipmatches);
    $clientip = $clientipmatches[0] ? $clientipmatches[0] : 'unknown';
    return $clientip;
}

// 计算身份证校验码，根据国家标准GB 11643-1999  
function idcard_verify_number($idcard_base) {
    if (strlen($idcard_base) != 17) {
        return false;
    }
    $factor = array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); // 加权因子
    $verify_number_list = array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); // 校验码对应值
    $checksum = 0;
    for ($i = 0; $i < strlen($idcard_base); $i++) {
        $checksum +=substr($idcard_base, $i, 1) * $factor[$i];
    }
    $mod = $checksum % 11;
    $verify_number = $verify_number_list[$mod];
    return $verify_number;
}

function idcard_15to18($idcard) {
    if (array_search(substr($idcard, 12, 3), array('996', '997', '998', '999'))) {
        $idcard = substr($idcard, 0, 6) . '18' . substr($idcard, 6, 9);
    } else {
        $idcard = substr($idcard, 0, 6) . '19' . substr($idcard, 6, 9);
    }
    $idcard = $idcard . idcard_verify_number($idcard);
    return $idcard;
}

function idcard_checksum18($idcard) {
    if ((strlen($idcard) != 18) && (strlen($idcard) != 15)) {
        return false;
    }
    if ((strlen($idcard) == 15)) {
        $idcard = idcard_15to18($idcard);
    }
    $idcard_base = substr($idcard, 0, 17);
    if (idcard_verify_number($idcard_base) != strtoupper(substr($idcard, 17, 1))) {
        return false;
    } else {
        return true;
    }
}

function random($length, $numeric = 0) { //获得随机数
    PHP_VERSION < '4.2.0' ? mt_srand((double) microtime() * 1000000) : mt_srand();
    $seed = base_convert(md5(print_r($_SERVER, 1) . microtime()), 16, $numeric ? 10 : 35);
    $seed = $numeric ? (str_replace('0', '', $seed) . '012340567890') : ($seed . 'zZ' . strtoupper($seed));
    $hash = '';
    $max = strlen($seed) - 1;
    for ($i = 0; $i < $length; $i++) {
        $hash .= $seed[mt_rand(0, $max)];
    }
    return $hash;
}

function gnh_fopen($url, $limit = 0, $post = '', $cookie = '', $bysocket = FALSE, $ip = '', $timeout = 15, $block = TRUE) {
    $return = '';
    $matches = parse_url($url);
    !isset($matches['host']) && $matches['host'] = '';
    !isset($matches['path']) && $matches['path'] = '';
    !isset($matches['query']) && $matches['query'] = '';
    !isset($matches['port']) && $matches['port'] = '';
    $host = $matches['host'];
    $path = $matches['path'] ? $matches['path'] . ($matches['query'] ? '?' . $matches['query'] : '') : '/';
    $port = !empty($matches['port']) ? $matches['port'] : 80;
    if ($post) {
        $out = "POST $path HTTP/1.0\r\n";
        $out .= "Accept: */*\r\n";
        //$out .= "Referer: $boardurl\r\n";
        $out .= "Accept-Language: zh-cn\r\n";
        $out .= "Content-Type: application/x-www-form-urlencoded\r\n";
        $out .= "User-Agent: $_SERVER[HTTP_USER_AGENT]\r\n";
        $out .= "Host: $host\r\n";
        $out .= 'Content-Length: ' . strlen($post) . "\r\n";
        $out .= "Connection: Close\r\n";
        $out .= "Cache-Control: no-cache\r\n";
        $out .= "Cookie: $cookie\r\n\r\n";
        $out .= $post;
    } else {
        $out = "GET $path HTTP/1.0\r\n";
        $out .= "Accept: */*\r\n";
        //$out .= "Referer: $boardurl\r\n";
        $out .= "Accept-Language: zh-cn\r\n";
        $out .= "User-Agent: $_SERVER[HTTP_USER_AGENT]\r\n";
        $out .= "Host: $host\r\n";
        $out .= "Connection: Close\r\n";
        $out .= "Cookie: $cookie\r\n\r\n";
    }

    if (function_exists('fsockopen')) {
        $fp = @fsockopen(($ip ? $ip : $host), $port, $errno, $errstr, $timeout);
    } elseif (function_exists('pfsockopen')) {
        $fp = @pfsockopen(($ip ? $ip : $host), $port, $errno, $errstr, $timeout);
    } else {
        $fp = false;
    }

    if (!$fp) {
        return '';
    } else {
        stream_set_blocking($fp, $block);
        stream_set_timeout($fp, $timeout);
        @fwrite($fp, $out);
        $status = stream_get_meta_data($fp);
        if (!$status['timed_out']) {
            while (!feof($fp)) {
                if (($header = @fgets($fp)) && ($header == "\r\n" || $header == "\n")) {
                    break;
                }
            }

            $stop = false;
            while (!feof($fp) && !$stop) {
                $data = fread($fp, ($limit == 0 || $limit > 8192 ? 8192 : $limit));
                $return .= $data;
                if ($limit) {
                    $limit -= strlen($data);
                    $stop = $limit <= 0;
                }
            }
        }
        @fclose($fp);
        return $return;
    }
}

function nongli($begin_time, $end_time) {
    require_once 'inc/nongli.php';
    $lunar = new Lunar();
    $fest = array();
    $festconfig = array(
        "yd" => array('type' => 'com', 'date' => array('year-01-01')), //元旦
        "cj" => array('type' => 'cn', 'date' => array('year-01-01')), //春节
        "ldj" => array('type' => 'com', 'date' => array('year-05-01')), //劳动节
        "qm" => array('type' => 'cn', 'date' => array('year-04-05')), //清明
        "dwj" => array('type' => 'cn', 'date' => array('year-05-05')), //端午节
        "zqj" => array('type' => 'cn', 'date' => array('year-08-15')), //中秋节
        "gqj" => array('type' => 'com', 'date' => array('year-10-01', 'year-10-02', 'year-10-03'))//国庆节
    );
    $festconfig = json_encode($festconfig);
    $festconfig = str_replace("year", date("Y", strtotime($begin_time)), $festconfig);
    $festconfig = json_decode($festconfig, true);
    $fest_arr = array();
    foreach ($festconfig as $k => $v) {
        foreach ($v['date'] as $t) {
            if ($v['type'] == 'cn') {
                if ($k == 'cj') {
                    array_push($fest_arr, date("Y-m-d", ($lunar->L2S($t) - 86400)));
                    array_push($fest_arr, date("Y-m-d", $lunar->L2S($t)));
                    array_push($fest_arr, date("Y-m-d", ($lunar->L2S($t) + 86400)));
                } else {
                    array_push($fest_arr, date("Y-m-d", $lunar->L2S($t)));
                }
            } else {
                array_push($fest_arr, $t);
            }
        }
    }
    $day = int_val((strtotime($end_time) - strtotime($begin_time)) / 86400);
    for ($i = 0; $i <= $day; $i++) {
        $date = strtotime($begin_time) + 86400 * $i;
        $month_day = date("Y-m-d", $date);
        if (in_array($month_day, $fest_arr)) {
            array_push($fest, $month_day);
        }
    }
    return $fest;
}
?>