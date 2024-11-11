<?php
// 設置 CORS 頭部，允許來自所有源的請求（開發時使用，生產環境中需小心處理）
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 獎項數據的示例存儲方式
$file = 'data.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 獲取獎項數據
    if (file_exists($file)) {
        $data = file_get_contents($file);
        echo $data;
    } else {
        echo json_encode([]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 更新獎項數據
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['prizes']) && is_array($input['prizes'])) {
        file_put_contents($file, json_encode($input['prizes'], JSON_PRETTY_PRINT));
        echo json_encode(["message" => "獎項已更新"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "請提供有效的獎項清單"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "不支援的請求方法"]);
}
?>
