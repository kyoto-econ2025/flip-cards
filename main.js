// フィッシャー・イェーツ・シャッフル
// Array は[]で作る配列のこと。
// prototype は「機能の設計図」のようなもの。
// Array.prototype.shuffle = ..と書くことで
// 「このプログラムで作るすべての配列はいつでも.shuffle()　という
// 命令で使えるようになる」という設定をしている。
Array.prototype.shuffle = function () {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};

let timer = NaN; // クリアまでの時間計測用タイマー
let flipTimer = NaN; // 裏に戻すためのタイマー
let score = 0; // スコア
let prevCard = null; // 1枚目に裏返したカード
let startTime = null; // ゲーム開始時刻

// 初期化関数
function init() {
  // カードの数字（1〜10を2つずつ）を用意し、配列に入れる
  let table = document.getElementById("table");
  let cards = []; // カード格納用配列
  for (let i = 1; i <= 10; i++) {
    cards.push(i);
    cards.push(i);
  }
  cards.shuffle(); // カードをシャッフル

  for (let i = 0; i < 4; i++) {
    let tr = document.createElement("tr"); // 行<tr>作成
    for (let j = 0; j < 5; j++) {
      let td = document.createElement("td"); // 列<td>作成
      td.className = "card back";
      td.number = cards[i * 5 + j];
      td.onclick = flip; // クリック時のハンドラ登録
      tr.appendChild(td); // 列<td>を行<tr>に追加
    }
    table.appendChild(tr); // 行<tr>を<table>に追加
  }

  startTime = new Date(); // ゲーム開始時刻を保存
  timer = setInterval(tick, 1000);  // タイマー開始
}

// 経過時間計測用タイマー（１秒ごとに実行）
function tick() {
  let now = new Date();
  let elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  document.getElementById("time").textContent = elapsed; // 経過時刻を表示
}

// カード裏返し
function flip(e) {
  let src = e.target; // クリックされた要素
  if (flipTimer || src.textContent != "") {
    return; // すでに２枚反転 or 反転済のカードクリック時は何もしない
  }

  let num = src.number;
  src.className = "card"; // class属性を設定して表面に
  src.textContent = num; // カードの数字を表示

  // １枚目のときは、それを記録して関数を抜ける
  if (prevCard == null) {
    prevCard = src;
    return;
  }

  // ２枚目 - カード一致判定
  if (prevCard.number == num) {
    if (++score == 10) {
      clearInterval(timer); // すべて揃ったらタイマーを止める
    }
    prevCard = null;
    clearTimeout(flipTimer); // 裏返すタイマーを止める
  } else {
    // カード不一致の場合は1秒後にカード2枚を裏返しにする
    flipTimer = setTimeout(function () {
      src.className = "card back";
      src.textContent = "";
      prevCard.className = "card back";
      prevCard.textContent = "";
      prevCard = null;
      flipTimer = NaN;
    }, 1000);
  }
}