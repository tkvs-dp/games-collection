# 存檔點（Save Point）

「存檔點」是一個以手機優先設計的純靜態網站（只用 HTML、CSS、JavaScript，不需要安裝套件或編譯工具），收錄了五款陪伴作者度過數百到數千小時的遊戲：**Minecraft**、**光遇（Sky）**、**第五人格（Identity V）**、**傳說對決（Arena of Valor）** 與 **三角洲行動（Delta Force）**。

在這個網站上，你可以：
- **轉動 3D 浮空群島**：首頁用 Three.js 做出五座低多邊形（Low-poly）小島，左右滑動可以旋轉群島、點擊島嶼就能進入該遊戲的世界。
- **閱讀個人存檔與心得**：每款遊戲都有原創動態 SVG 插畫，以及仿照 Steam 風格設計的「介紹、玩法、推薦原因、心得」四個切換分頁。
- **挑戰一分鐘街機小遊戲**：每款遊戲都附有一個單手就能玩的迷你挑戰（挖礦踩地雷、收集光之翼、校準密碼機、小兵補刀、撤離前清點），最佳分數會自動保存在你的瀏覽器裡。

---

## 怎麼打開這個網站？

因為整個專案沒有使用任何需要打包的框架，你有兩種方式可以直接打開它：

### 方法一：直接點兩下打開（最快）
在檔案總管找到專案資料夾裡的 `index.html`，直接滑鼠點兩下用瀏覽器打開就能玩了。

### 方法二：用本機伺服器打開（推薦練習寫程式時用）
如果你的電腦有裝 Python，可以在專案資料夾打開終端機（Terminal），輸入：

```bash
python3 -m http.server 8000
```

接著打開瀏覽器前往 `http://localhost:8000` 即可（或是使用 VS Code 的 **Live Server** 延伸模組）。

> **小提醒**：首頁的 3D 群島（Three.js r149）與字型（Google Fonts 的 Inter / Noto Sans TC）是從網路 CDN 載入的，打開時需要連上網路。如果沒有網路或裝置不支援 WebGL，首頁會自動切換成圓角圖示按鈕（Fallback 機制），網站依然可以正常瀏覽與遊玩小遊戲！

---

## 資料夾與檔案結構

整個專案檔案很少，每個檔案負責的事情都很清楚：

```text
games-collection/
├── index.html              # 首頁：包含導覽列、3D 浮空群島區、我的存檔列表、街機列表
├── game.html               # 遊戲內頁模板：根據網址 ?id=xxx 動態載入對應的遊戲內容與小遊戲
├── DESIGN.md               # 視覺設計規範（參考 Mobbin 風格：黑白極簡介面，把色彩留給遊戲插畫）
├── css/
│   └── style.css           # 全站樣式表：CSS 變數（Design Tokens）、響應式排版、元件與 SVG 動畫
└── js/
    ├── data.js             # 遊戲資料庫：五款遊戲的介紹、時數、心得文字，以及 localStorage 最高分讀寫
    ├── scenes.js           # 原創美術：用程式碼畫出五款遊戲的動態 SVG 場景與圓角方形（Squircle）圖示
    ├── hero3d.js           # 首頁 3D 群島：用 Three.js 堆出五座小島、處理滑動旋轉與點擊判定
    ├── home.js             # 首頁邏輯：把 data.js 的資料依遊玩時數排序，渲染到首頁並啟動 3D 群島
    ├── game-page.js        # 遊戲頁邏輯：讀取網址參數、渲染內容、處理分頁（Tabs）切換與鍵盤操作
    ├── arcade.js           # 小遊戲共用外殼：統一處理開始/結束畫面、計分板（HUD）、Canvas 縮放與遊戲迴圈
    └── minigames/
        ├── mine.js         # Minecraft 小遊戲：「挖到鑽石」（6×6 網格推理鑽石位置、躲開岩漿）
        ├── sky.js          # 光遇小遊戲：「收集光之翼」（拖曳飛行收集光點、閃避冥龍探照燈）
        ├── cipher.js       # 第五人格小遊戲：「校準密碼機」（看準指針轉動時機點擊金色校準區）
        ├── lasthit.js      # 傳說對決小遊戲：「補刀大師」（看準小兵血量低於白色刻度時普攻尾刀）
        └── extract.js      # 三角洲行動小遊戲：「撤離前清點」（30 秒內快速點擊橘色敵人、避開藍色友軍）
```

---

## 改成你自己的！

`js/data.js` 裡面的遊玩時數和心得目前都是草稿，非常適合直接改成你自己的故事。

### 1. 修改文字、時數與心得
打開 `js/data.js`，你會看到 `SP.games` 陣列，裡面每一個物件就是一款遊戲：

```javascript
{
  id: 'minecraft',
  name: 'Minecraft',
  short: 'Minecraft',
  dev: 'Mojang Studios',
  year: '2011',
  genre: '沙盒生存',
  platforms: 'PC、主機、手機',
  tags: ['沙盒', '生存', '建造', '多人合作'],
  hours: 1860, // <-- 改成你的遊玩時數（首頁會自動依這個數字由高到低排序！）
  color: '#5fae3b',
  stageBg: '#3b2b20',
  tagline: '一個方塊一個方塊，把空地變成只屬於我們的城市。', // <-- 首頁與內頁的一句話簡介
  intro: [ /* 遊戲介紹段落 */ ],
  howto: [ /* 玩法步驟：{ t: '標題', d: '說明' } */ ],
  why:   [ /* 推薦原因：{ t: '標題', d: '說明' } */ ],
  review: {
    quote: '它是我唯一玩了十年還會在半夜想「明天要蓋什麼」的遊戲。',
    body: [ /* 心得內文段落 */ ],
    pros: ['想玩多久就玩多久，沒有壓力', /* ... */],
    cons: ['剛開始容易不知道要做什麼', /* ... */]
  },
  challenge: {
    title: '挖到鑽石。',
    rules: '點方塊挖掘，鎬子只能揮 20 次……',
    tip: '數字是相鄰八格裡的鑽石數量。'
  }
}
```

只要改完存檔、重新整理網頁，首頁的排序、時數跟內頁文字就會全部一起更新。

### 2. 如果想新增或替換成別款遊戲？
除了在 `js/data.js` 新增一筆遊戲資料（假設 `id` 叫做 `'valorant'`）之外，還有 4 個地方要一起配合：
1. **`js/scenes.js`**：在 `scenes` 補上 `scenes.valorant`（回傳 400×250 的橫幅 SVG 字串），並在 `icons` 補上 `icons.valorant`（回傳 64×64 的圖示 SVG 字串）。
2. **`js/hero3d.js`**：在 `builders` 補上 `builders.valorant = function (g, anim) { ... }`，用 Three.js 的基本幾何體（方塊、圓柱、圓錐等）幫它蓋一座專屬小島。
3. **`js/minigames/`**：新增一個小遊戲腳本（例如 `js/minigames/valorant.js`），註冊 `SP.minigames.valorant = { preview: function(api){...}, start: function(api){...} }`。
4. **`game.html`**：在 `</body>` 前面加上一行 `<script src="js/minigames/valorant.js" defer></script>`。

---

## 從這個專案可以學到什麼？

如果你正在學網頁前端，可以順著下面這份清單打開對應的檔案看看是怎麼寫出來的：

- **CSS 變數與設計系統（Design Tokens）** → `css/style.css`、`DESIGN.md`
  在 `:root` 定義顏色（`--ink`、`--canvas`）、圓角（`--r-md`、`--r-full`）與間距（`--s-md`），全站介面保持黑白灰極簡，讓遊戲插畫的色彩自然跳出來。
- **行動優先的響應式排版（Mobile-First RWD）** → `css/style.css`
  預設先寫手機直向的單欄版面，再用 `@media (min-width: 640px)`、`720px`、`960px` 逐步切換成雙欄網格與桌面版左右排版，並用 `clamp()` 讓標題字級隨螢幕寬度平滑縮放。
- **用程式碼畫 SVG 與無縫循環動畫** → `js/scenes.js`、`css/style.css`
  在 `scenes.js` 裡有個小巧思：`loop()` 函式把雲朵或霧氣複製兩份、相隔 `400` 單位，搭配 CSS 的 `@keyframes drift` 往左平移 `-400px`，就能做出無限循環飄動的背景。
- **Canvas 2D 遊戲迴圈與高解析度適配** → `js/arcade.js`、`js/minigames/*.js`
  `arcade.js` 的 `api.canvas()` 會根據裝置的 `devicePixelRatio` 放大畫布像素，避免在手機Retina螢幕上模糊；`api.loop()` 則封裝了 `requestAnimationFrame`，計算每一幀的時間差 `dt`（Delta Time），讓不同螢幕更新率下的移動速度保持一致。
- **觸控與滑鼠統一事件（Pointer Events & `touch-action`）** → `js/hero3d.js`、`css/style.css`
  使用 `pointerdown` / `pointermove` / `pointerup` 同時處理手指觸控與滑鼠拖曳；並在 3D 群島與遊戲舞台設定 `touch-action: pan-y`（遊玩中切換為 `touch-action: none`），避免左右滑動時不小心觸發瀏覽器翻頁或整頁亂捲。
- **Three.js 3D 入門與 2D 標籤投影** → `js/hero3d.js`
  展示如何建立場景（`Scene`）、相機（`PerspectiveCamera`）、燈光與平面著色材質（`flatShading: true`），並用 `Raycaster` 判斷點擊了哪座島、用 `Vector3.project(camera)` 把 3D 座標轉換成 HTML 標籤在螢幕上的 `(x, y)` 位置。
- **用 `localStorage` 保存最佳紀錄** → `js/data.js`
  在 `SP.best` 裡用不到 10 行程式碼，把每款小遊戲的最高分存在瀏覽器的 `localStorage`（鍵名為 `sp-best-<遊戲id>`），關掉分頁重開紀錄也不會消失。
- **無障礙體驗（Accessibility / ARIA）與減少動態偏好** → `js/game-page.js`、`css/style.css`
  遊戲分頁使用了標準的 `role="tablist"`、`role="tab"`、`aria-selected` 與方向鍵（`ArrowLeft` / `ArrowRight`）切換；小遊戲也支援鍵盤（空白鍵、方向鍵、數字鍵 1–5）。若使用者在系統開啟「減少動態效果」（`prefers-reduced-motion: reduce`），CSS 動畫與 3D 自動旋轉都會自動停下。

---

## 練習題（動手試試看！）

讀懂結構之後，不妨挑一兩個小任務練習改改看：

1. **🌱 入門｜換上你的私房清單**：打開 `js/data.js`，把其中一款遊戲的 `hours`（時數）、`tagline` 跟 `review` 改成你自己的真實心得，看看首頁「我的存檔」的排序有沒有跟著改變。
2. **🌿 初階｜調整小遊戲難度**：打開 `js/minigames/mine.js`，把最上面的 `SWINGS = 20`（鎬子次數）或 `DIAMONDS = 4`（鑽石數量）改掉；或是去 `js/minigames/lasthit.js` 調整 `DAMAGE = 24` 與冷卻時間 `COOLDOWN = 0.55`，體驗一下遊戲平衡設計師的感覺。
3. **🌲 中階｜加一顆「清除最高分」按鈕**：在首頁的「街機」區塊（`index.html` 與 `js/home.js`）加一顆小按鈕，點下去時清除 `localStorage` 裡的 `sp-best-*` 紀錄並重新渲染列表。
4. **🏔️ 進階｜打造第六座島嶼**：挑一款你最愛的第六個遊戲，幫它在 `data.js` 建立資料、在 `scenes.js` 畫一張 SVG、在 `hero3d.js` 蓋一座小島，並設計一個屬於它的 30 秒迷你挑戰！

---

## 怎麼發佈到 GitHub Pages？

這個專案不需要任何編譯步驟，放上 GitHub 就能直接變成公開網站：

1. 把整個專案推送（Push）到你的 GitHub 儲存庫（Repository）的 `main` 分支。
2. 點進 GitHub 儲存庫頁面上方的 **Settings**（設定）。
3. 在左側選單找到 **Pages**。
4. 在 **Build and deployment** 下方的 **Source** 選擇 **Deploy from a branch**。
5. **Branch** 選擇 `main`，資料夾選擇 `/ (root)`，然後按下 **Save**。
6. 等大約 1～2 分鐘重新整理頁面，就會看到網站上線的網址了！

以本專案的學校組織儲存庫（`https://github.com/tkvs-dp/games-collection`）為例，發佈後的網址會是：
**https://tkvs-dp.github.io/games-collection/**

---

## 聲明與致謝

- 本專案為學生與玩家的非營利個人收藏與前端教學示範作品，與任何遊戲開發商或發行商無關。
- 網站中提及之遊戲名稱（Minecraft、光遇 Sky、第五人格 Identity V、傳說對決 Arena of Valor、三角洲行動 Delta Force）及其相關商標，皆屬各該原公司所有。
- 網站內所有的 SVG 場景、圓角圖示與 Three.js 3D 低多邊形島嶼皆為以程式碼手繪之原創粉絲插畫（Original Fan Illustrations），未使用任何官方美術素材。
