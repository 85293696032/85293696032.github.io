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
const { setGlobalOptions } = require("firebase-functions");
const admin = require("firebase-admin");

setGlobalOptions({ maxInstances: 10 });

// 初始化 Firebase Admin（Firestore）
admin.initializeApp();
const db = admin.firestore();

/**
 * WhatsApp Webhook 接收入口
 * 只記錄 text === "123" 的訊息
 */
exports.whatsappWebhook = onRequest(async (req, res) => {
  try {
    // WhatsApp webhook 驗證（GET）
    if (req.method === "GET") {
      const VERIFY_TOKEN = "VERIFY_TOKEN_123"; // 之後你在 Meta 後台填同一個
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }

    // 接收訊息（POST）
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text") {
      return res.sendStatus(200);
    }

    const text = message.text.body;
    const from = message.from; // 客戶電話號碼（不含 +）

    // 只處理「123」
    if (text !== "123") {
      return res.sendStatus(200);
    }

    // 寫入 Firestore
    await db.collection("ws_messages").add({
      from: from,
      text: text,
      phone_number_id: value.metadata.phone_number_id,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
});
