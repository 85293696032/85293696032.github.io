先準備一個全新沒用過任何whatsapp服務的手機號碼。

登入 facebook 帳號

逵入meta開發者
https://developers.facebook.com/

建立應用程式 / 我的應用程式

建立應用程式 > 應用程式名稱(隨便)

透過whatsapp與顧客建立聯繫 > 繼續

建立商家資產管理組合(隨便) > 繼續 > 下一步

前往主版面 > 測試使用案例 > 圖形api > 用戶或粉絲專頁 > 取得應用程式權限 > 提交

https://developers.facebook.com/apps/

===

剛建的應用程式 > 發佈 > 透過 WhatsApp 與顧客建立聯繫:

API設定:

步驟1： 選擇電話號碼:

  填寫 全新沒用過任何whatsapp服務的手機號碼

步驟3： 設定 Webhooks 以接收訊息:

  回呼網址: https://us-central1-project-253944507993954601.cloudfunctions.net/whatsappWebhook


  驗證權杖:VERIFY_TOKEN_123

  Webhook 欄位 > messages > 勾選 訂閱

===

剛建的應用程式 > 請確認符合所有要求，再發佈應用程式。 > 隱私政策網址 > 隱私政策網址:
​https://raw.githubusercontent.com/64071181/64071181.github.io/refs/heads/main/PrivacyPolicy.md

儲存變更

發佈 > 發佈

===

產生永久存取權杖:

https://business.facebook.com/latest/settings/business_users/?business_id=2307535139468151

左上選剛建app

左2上 > 用戶 > 系統工作人員

新增 > 隨便名 

指派資產 > 應用程式(剛建app)[完整控制權] > ws帳號(正式號)[完整控制權] > 指派資產

F5 > 產生權杖 > 剛建app > 永不 > 
business_management
whatsapp_business_messaging
whatsapp_business_management
> 產生權杖(只會顯示一次，請立刻存好)

cmd
firebase functions:config:set whatsapp.token="剛剛那一大串token"




https://console.firebase.google.com/project/project-253944507993954601/overview

https://us-central1-project-253944507993954601.cloudfunctions.net/whatsappWebhook