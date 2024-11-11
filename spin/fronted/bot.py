import aiohttp
from telegram import Update, Bot
from telegram.ext import Application, CommandHandler, ContextTypes

TELEGRAM_TOKEN = '7519014238:AAH7OuMtsZpdVgwwhyPy21KqdcpOdSMSE7k'  # 替換為你的 Telegram Bot Token

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    args = context.args  # 獲取命令後面的參數
    if not args:
        await update.message.reply_text("請提供手機號碼作為參數。")
        return

    mobile = args[0]  # 獲取手機號碼
    await update.message.reply_text(f"收到手機號碼：{mobile}，正在驗證身份...")

    # 向後端 API 發送身份驗證請求
    async with aiohttp.ClientSession() as session:
        async with session.post('https://mrwira.com/api/v1/index.php', data={
            "module": "/member/get",
            "accessId": 242298430,
            "accessToken": '62d5195deb6f770c707391630ed412b958aa0c2ade04440ee3320b8d94caf806',
            "mobile": mobile
        }) as response:
            if response.status == 200:
                result = await response.json()
                # 打印 API 獲取的資料
                print("API 獲取的資料:", result)
                if result.get("status") == "SUCCESS":
                    await update.message.reply_text("身份驗證成功！")
                else:
                    await update.message.reply_text("身份驗證失敗。")
            else:
                print("API 請求失敗，狀態碼:", response.status)
                await update.message.reply_text("驗證過程中出現錯誤。")

if __name__ == '__main__':
    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    # 啟動 Bot
    app.run_polling()
