import requests

# 設置 API 請求數據
url = "https://mrwira.com/api/v1/index.php"  # 替換為你的 API URL
headers = {
    "Content-Type": "application/json"  # 如果你的 API 需要其他頭部，根據需要添加
}

data = {
    "module": "/member/get",
    "accessId": 242298430,
    "accessToken": "62d5195deb6f770c707391630ed412b958aa0c2ade04440ee3320b8d94caf806",
    "mobile": "01234567890"
}

# 發送 POST 請求
response = requests.post(url, json=data, headers=headers)

# 處理響應
if response.status_code == 200:
    # 請求成功，處理響應數據
    print("成功響應:", response.json())
else:
    # 請求失敗
    print("請求失敗，狀態碼:", response.status_code)
    print("響應內容:", response.text)
