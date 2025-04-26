let carData = {};

// データ取得
fetch('car-models.json')
  .then(response => response.json())
  .then(data => {
    carData = data;
    setupOwnedCarSelectors();
    setupAddCandidateButton();
  });

// 所有車選択セットアップ
function setupOwnedCarSelectors() {
  const ownCarExists = document.getElementById('own-car-exists');
  const ownCarSelectors = document.getElementById('own-car-selectors');

  ownCarExists.addEventListener('change', () => {
    if (ownCarExists.value === 'yes') {
      ownCarSelectors.style.display = 'block';
      populateMakerSelect('own-maker-select', carData);
    } else {
      ownCarSelectors.style.display = 'none';
    }
  });

  setupSelectorChain('own-maker-select', 'own-model-select', 'own-year-select', 'own-grade-select');
}

// 購入候補追加ボタンセットアップ
function setupAddCandidateButton() {
  const addButton = document.getElementById('add-candidate-button');
  const candidatesList = document.getElementById('candidates-list');

  addButton.addEventListener('click', () => {
    const candidateId = Date.now();
    const candidateDiv = document.createElement('div');
    candidateDiv.className = 'candidate';
    candidateDiv.dataset.id = candidateId;

    candidateDiv.innerHTML = `
      <hr>
      <select class="maker-select"></select>
      <select class="model-select"></select>
      <select class="year-select"></select>
      <select class="grade-select"></select>

      <label>新車/中古車を選択：</label>
      <select class="new-used-select">
        <option value="">選択してください</option>
        <option value="new">新車</option>
        <option value="used">中古車</option>
      </select>

      <div class="mileage-input" style="display:none;">
        <label>走行距離 (km):</label>
        <input type="number" class="mileage-field" placeholder="例：30000">
      </div>
    `;

    candidatesList.appendChild(candidateDiv);

    // 各セレクターにイベント設定
    populateMakerSelect(candidateDiv.querySelector('.maker-select'), carData);
    setupSelectorChain(
      candidateDiv.querySelector('.maker-select'),
      candidateDiv.querySelector('.model-select'),
      candidateDiv.querySelector('.year-select'),
      candidateDiv.querySelector('.grade-select')
    );

    const newUsedSelect = candidateDiv.querySelector('.new-used-select');
    newUsedSelect.addEventListener('change', () => {
      const mileageInput = candidateDiv.querySelector('.mileage-input');
      if (newUsedSelect.value === 'used') {
        mileageInput.style.display = 'block';
      } else {
        mileageInput.style.display = 'none';
      }
    });
  });
}

// メーカー選択を作成
function populateMakerSelect(selectIdOrElement, data) {
  const select = typeof selectIdOrElement === 'string' ? document.getElementById(selectIdOrElement) : selectIdOrElement;
  select.innerHTML = '<option value="">メーカーを選択</option>';
  for (const maker in data) {
    const option = document.createElement('option');
    option.value = maker;
    option.textContent = maker;
    select.appendChild(option);
  }
}

// 連動するセレクター設定
function setupSelectorChain(makerId, modelId, yearId, gradeId) {
  const makerSelect = typeof makerId === 'string' ? document.getElementById(makerId) : makerId;
  const modelSelect = typeof modelId === 'string' ? document.getElementById(modelId) : modelId;
  const yearSelect = typeof yearId === 'string' ? document.getElementById(yearId) : yearId;
  const gradeSelect = typeof gradeId === 'string' ? document.getElementById(gradeId) : gradeId;

  makerSelect.addEventListener('change', () => {
    modelSelect.innerHTML = '<option value="">車種を選択</option>';
    yearSelect.innerHTML = '<option value="">年式を選択</option>';
    gradeSelect.innerHTML = '<option value="">グレードを選択</option>';
    if (makerSelect.value && carData[makerSelect.value]) {
      for (const model in carData[makerSelect.value]) {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      }
    }
  });

  modelSelect.addEventListener('change', () => {
    yearSelect.innerHTML = '<option value="">年式を選択</option>';
    gradeSelect.innerHTML = '<option value="">グレードを選択</option>';
    if (makerSelect.value && modelSelect.value && carData[makerSelect.value][modelSelect.value]) {
      for (const year in carData[makerSelect.value][modelSelect.value]) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      }
    }
  });

  yearSelect.addEventListener('change', () => {
    gradeSelect.innerHTML = '<option value="">グレードを選択</option>';
    if (makerSelect.value && modelSelect.value && yearSelect.value && carData[makerSelect.value][modelSelect.value][yearSelect.value]) {
      const grades = carData[makerSelect.value][modelSelect.value][yearSelect.value].grades;
      for (const grade of grades) {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        gradeSelect.appendChild(option);
      }
    }
  });
}
