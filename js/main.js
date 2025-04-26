// js/main.js

// グローバル変数
let carData = {};

// ページが読み込まれたら実行
document.addEventListener("DOMContentLoaded", function() {
  // car-models.jsonを取得
  fetch('js/car-models.json')
    .then(response => response.json())
    .then(data => {
      carData = data;
      console.log("データ読み込み成功", carData);
      populateMakers();
    })
    .catch(error => {
      console.error("データ読み込みエラー", error);
    });
});

// メーカー選択肢を作成
function populateMakers() {
  const makerSelect = document.getElementById("maker-select");
  makerSelect.innerHTML = "<option value=''>メーカーを選択</option>";
  Object.keys(carData).forEach(maker => {
    const option = document.createElement("option");
    option.value = maker;
    option.textContent = maker;
    makerSelect.appendChild(option);
  });
}

// 車種選択肢を作成
function populateModels(maker) {
  const modelSelect = document.getElementById("model-select");
  modelSelect.innerHTML = "<option value=''>車種を選択</option>";
  if (maker && carData[maker]) {
    Object.keys(carData[maker]).forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }
}

// 年式選択肢を作成
function populateYears(maker, model) {
  const yearSelect = document.getElementById("year-select");
  yearSelect.innerHTML = "<option value=''>年式を選択</option>";
  if (maker && model && carData[maker][model]) {
    Object.keys(carData[maker][model]).forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }
}

// グレード選択肢を作成
function populateGrades(maker, model, year) {
  const gradeSelect = document.getElementById("grade-select");
  gradeSelect.innerHTML = "<option value=''>グレードを選択</option>";
  if (maker && model && year && carData[maker][model][year]) {
    Object.keys(carData[maker][model][year]).forEach(grade => {
      const option = document.createElement("option");
      option.value = grade;
      option.textContent = grade;
      gradeSelect.appendChild(option);
    });
  }
}

// 維持費情報を表示
function showMaintenanceCost(maker, model, year, grade) {
  const outputDiv = document.getElementById("output");
  if (maker && model && year && grade && carData[maker][model][year][grade]) {
    const data = carData[maker][model][year][grade];
    outputDiv.innerHTML = `
      <h3>維持費情報</h3>
      <ul>
        <li>税金: ¥${data.税金.toLocaleString()}</li>
        <li>保険料目安: ¥${data.保険料目安.toLocaleString()}</li>
        <li>燃費: ${data.燃費} km/L</li>
        <li>故障率: ${(data.故障率 * 100).toFixed(1)}%</li>
      </ul>
    `;
  } else {
    outputDiv.innerHTML = "";
  }
}

// セレクトボックスのイベントリスナー設定
document.addEventListener("change", function(e) {
  if (e.target.id === "maker-select") {
    populateModels(e.target.value);
    document.getElementById("model-select").value = "";
    document.getElementById("year-select").innerHTML = "";
    document.getElementById("grade-select").innerHTML = "";
    document.getElementById("output").innerHTML = "";
  } else if (e.target.id === "model-select") {
    const maker = document.getElementById("maker-select").value;
    populateYears(maker, e.target.value);
    document.getElementById("year-select").value = "";
    document.getElementById("grade-select").innerHTML = "";
    document.getElementById("output").innerHTML = "";
  } else if (e.target.id === "year-select") {
    const maker = document.getElementById("maker-select").value;
    const model = document.getElementById("model-select").value;
    populateGrades(maker, model, e.target.value);
    document.getElementById("grade-select").value = "";
    document.getElementById("output").innerHTML = "";
  } else if (e.target.id === "grade-select") {
    const maker = document.getElementById("maker-select").value;
    const model = document.getElementById("model-select").value;
    const year = document.getElementById("year-select").value;
    showMaintenanceCost(maker, model, year, e.target.value);
  }
});
