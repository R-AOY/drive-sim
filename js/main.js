let carData = {};

// データ読み込み
fetch("js/car-models.json")
  .then(response => {
    if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);
    return response.json();
  })
  .then(data => {
    carData = data;
    console.log("データロード完了:", carData); // デバッグ用
    initializeOwnCarSection();
  })
  .catch(error => console.error("データ読み込みエラー:", error));

// 現在所有している車セクション初期化
function initializeOwnCarSection() {
  const ownCarSelect = document.getElementById('own-car-select');
  const ownCarDetails = document.getElementById('own-car-details');
  const ownMake = document.getElementById('own-make');
  const ownModel = document.getElementById('own-model');
  const ownGrade = document.getElementById('own-grade');

  ownCarSelect.addEventListener('change', () => {
    ownCarDetails.style.display = (ownCarSelect.value === 'yes') ? 'block' : 'none';
  });

  if (Object.keys(carData).length === 0) {
    console.error("carData が空です。データが正しく取得されているか確認してください。");
    return;
  }

  populateSelect(ownMake, Object.keys(carData));

  ownMake.addEventListener('change', () => {
    populateSelect(ownModel, Object.keys(carData[ownMake.value] || {}));
    ownGrade.innerHTML = ''; 
  });

  ownModel.addEventListener('change', () => {
    populateSelect(ownGrade, carData[ownMake.value]?.[ownModel.value] || []);
  });
}

// 購入候補用カウント
let candidateCount = 0;

// 購入候補追加ボタン
document.getElementById('add-candidate').addEventListener('click', () => {
  candidateCount++;
  addCandidateForm(candidateCount);
});

// 購入候補フォームを追加
function addCandidateForm(id) {
  const container = document.getElementById('candidates-container');
  const div = document.createElement('div');
  div.id = `candidate-${id}`;
  div.style.marginBottom = "20px";
  div.innerHTML = `
    <h3>購入候補 ${id}</h3>
    <label>新車 or 中古車:</label>
    <select id="new-used-${id}">
      <option value="new">新車</option>
      <option value="used">中古車</option>
    </select>
    <div style="margin-top: 10px;">
      <label>メーカー:</label>
      <select id="make-${id}"></select>
    </div>
    <div>
      <label>車種:</label>
      <select id="model-${id}"></select>
    </div>
    <div>
      <label>グレード:</label>
      <select id="grade-${id}"></select>
    </div>
    <div id="mileage-div-${id}" style="display: none;">
      <label>走行距離(km):</label>
      <input type="number" id="mileage-${id}" min="0">
    </div>
  `;
  container.appendChild(div);

  const make = document.getElementById(`make-${id}`);
  const model = document.getElementById(`model-${id}`);
  const grade = document.getElementById(`grade-${id}`);
  const newUsed = document.getElementById(`new-used-${id}`);
  const mileageDiv = document.getElementById(`mileage-div-${id}`);

  if (Object.keys(carData).length === 0) {
    console.error("carData が空です。データが正しく取得されているか確認してください。");
    return;
  }

  populateSelect(make, Object.keys(carData));

  make.addEventListener('change', () => {
    populateSelect(model, Object.keys(carData[make.value] || {}));
    grade.innerHTML = ''; 
  });

  model.addEventListener('change', () => {
    populateSelect(grade, carData[make.value]?.[model.value] || []);
  });

  newUsed.addEventListener('change', () => {
    mileageDiv.style.display = (newUsed.value === 'used') ? 'block' : 'none';
  });
}

// 汎用セレクトボックス生成
function populateSelect(selectElement, options) {
  console.log("populateSelect に渡された options:", options); // デバッグ用
  selectElement.innerHTML = '<option value="">選択してください</option>';
  
  if (!Array.isArray(options)) {
    console.error("options は配列ではありません。データ構造を確認してください:", options);
    return;
  }

  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    selectElement.appendChild(opt);
  });
}
