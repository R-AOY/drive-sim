let carData = {};

// データ読み込み
fetch("/drive-sim/js/car-models.json")
  .then(response => response.json())
  .then(data => {
    carData = data;
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
    if (ownCarSelect.value === 'yes') {
      ownCarDetails.style.display = 'block';
    } else {
      ownCarDetails.style.display = 'none';
    }
  });

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

  // 各種イベント設定
  const make = document.getElementById(`make-${id}`);
  const model = document.getElementById(`model-${id}`);
  const grade = document.getElementById(`grade-${id}`);
  const newUsed = document.getElementById(`new-used-${id}`);
  const mileageDiv = document.getElementById(`mileage-div-${id}`);

  populateSelect(make, Object.keys(carData));

  make.addEventListener('change', () => {
    populateSelect(model, Object.keys(carData[make.value] || {}));
    grade.innerHTML = '';
  });

  model.addEventListener('change', () => {
    populateSelect(grade, carData[make.value]?.[model.value] || []);
  });

  newUsed.addEventListener('change', () => {
    if (newUsed.value === 'used') {
      mileageDiv.style.display = 'block';
    } else {
      mileageDiv.style.display = 'none';
    }
  });
}

// 汎用セレクトボックス生成
function populateSelect(selectElement, options) {
  selectElement.innerHTML = '';
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    selectElement.appendChild(opt);
  });
}
