/*
cmd

===

安裝:

cd C:\Users\mokaki\Desktop\金\篩單王

firebase logout

firebase login

firebase init

選功能（方向,空白鍵,enter） 
> Firestore , Functions
> Use an existing project
> 選你的「篩單王」Firebase 專案
Runtime 語言 > JavaScript
ESLint > No
自動 install dependencies > Yes

===

將 index.js 放到:
篩單王\functions\index.js

===

每次更新:

cd C:\Users\mokaki\Desktop\金\篩單王
firebase deploy --only functions
*/



const { onRequest } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params"); // 新增這行
const admin = require("firebase-admin");

// 定義環境變數 (這會取代舊的 functions.config)
const WHATSAPP_TOKEN = defineString("WHATSAPP_TOKEN"); 

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const VERIFY_TOKEN = "VERIFY_TOKEN_123";
const IndexPage = "https://85293696032.github.io/";

exports.whatsappWebhook = onRequest({ maxInstances: 10 }, async (req, res) => {
  try {
    // 1. WhatsApp Webhook 驗證 (GET)
    if (req.method === "GET") {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      }
      return res.sendStatus(403);
    }

    // 2. 接收訊息 (POST) - 使用你之前成功的解析邏輯
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text") {
      return res.sendStatus(200);
    }

    const text = message.text.body.trim();
    const from = message.from;
    const phoneNumberId = value.metadata?.phone_number_id;

    // 3. 處理 "123"
if (text === "123") {
      // 記錄到 Firestore
      await db.collection("ws_messages").add({
        from,
        text,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // --- 修改這裡：改用 WHATSAPP_TOKEN.value() ---
      const tokenValue = WHATSAPP_TOKEN.value(); 
      
      console.log(`📤 正在發送回覆給: ${from}`);

      const response = await fetch(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokenValue}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: `✅ 已記錄你的意向\n\n👉 查看名單：\n${IndexPage}` }
          })
        }
      );

      const result = await response.json();
      console.log("📩 WhatsApp API 回傳結果:", JSON.stringify(result));
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("🔥 發生錯誤:", err);
    return res.status(200).send("Error caught");
  }
});

