let carData = [];

async function loadCarData() {
  const response = await fetch('js/car-models.json');
  carData = await response.json();
}

function populateSelect(selectElement, options) {
  selectElement.innerHTML = '<option value="">選択してください</option>';
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    selectElement.appendChild(opt);
  });
}

// 所有している車の選択欄を作る
function initOwnerCarSelection() {
  const ownerSelects = {
    maker: document.getElementById('owner-maker'),
    car: document.getElementById('owner-car'),
    year: document.getElementById('owner-year'),
    grade: document.getElementById('owner-grade')
  };

  document.getElementById('own-car').addEventListener('change', (e) => {
    const hasCar = e.target.value;
    const ownerCarFields = document.getElementById('owner-car-fields');
    if (hasCar === 'yes') {
      ownerCarFields.style.display = 'block';
    } else {
      ownerCarFields.style.display = 'none';
    }
  });

  ownerSelects.maker.addEventListener('change', (e) => {
    const maker = e.target.value;
    const cars = carData.find(m => m.maker === maker)?.cars.map(c => c.name) || [];
    populateSelect(ownerSelects.car, cars);
    populateSelect(ownerSelects.year, []);
    populateSelect(ownerSelects.grade, []);
  });

  ownerSelects.car.addEventListener('change', (e) => {
    const maker = ownerSelects.maker.value;
    const car = e.target.value;
    const years = carData.find(m => m.maker === maker)?.cars.find(c => c.name === car)?.years.map(y => y.year) || [];
    populateSelect(ownerSelects.year, years);
    populateSelect(ownerSelects.grade, []);
  });

  ownerSelects.year.addEventListener('change', (e) => {
    const maker = ownerSelects.maker.value;
    const car = ownerSelects.car.value;
    const year = e.target.value;
    const grades = carData.find(m => m.maker === maker)?.cars.find(c => c.name === car)?.years.find(y => y.year === year)?.grades || [];
    populateSelect(ownerSelects.grade, grades);
  });
}

// 購入候補車両の選択欄を作る
function initPurchaseCandidates() {
  document.getElementById('add-candidate').addEventListener('click', () => {
    addCandidate();
  });
}

function addCandidate() {
  const container = document.getElementById('candidates');
  const candidateIndex = container.children.length;

  const candidateDiv = document.createElement('div');
  candidateDiv.className = 'candidate';
  candidateDiv.innerHTML = `
    <label>メーカー:
      <select id="candidate-maker-${candidateIndex}"></select>
    </label>
    <label>車種:
      <select id="candidate-car-${candidateIndex}"></select>
    </label>
    <label>年式:
      <select id="candidate-year-${candidateIndex}"></select>
    </label>
    <label>グレード:
      <select id="candidate-grade-${candidateIndex}"></select>
    </label>
    <label>購入予定車は中古車ですか？
      <select id="candidate-used-${candidateIndex}">
        <option value="">選択してください</option>
        <option value="yes">はい</option>
        <option value="no">いいえ</option>
      </select>
    </label>
    <div id="candidate-used-fields-${candidateIndex}" style="display: none;">
      <label>走行距離 (km):
        <input type="number" id="candidate-mileage-${candidateIndex}" placeholder="例: 50000">
      </label>
    </div>
    <hr>
  `;
  container.appendChild(candidateDiv);

  const makerSelect = document.getElementById(`candidate-maker-${candidateIndex}`);
  const carSelect = document.getElementById(`candidate-car-${candidateIndex}`);
  const yearSelect = document.getElementById(`candidate-year-${candidateIndex}`);
  const gradeSelect = document.getElementById(`candidate-grade-${candidateIndex}`);
  const usedSelect = document.getElementById(`candidate-used-${candidateIndex}`);
  const usedFields = document.getElementById(`candidate-used-fields-${candidateIndex}`);

  populateSelect(makerSelect, carData.map(m => m.maker));

  makerSelect.addEventListener('change', (e) => {
    const maker = e.target.value;
    const cars = carData.find(m => m.maker === maker)?.cars.map(c => c.name) || [];
    populateSelect(carSelect, cars);
    populateSelect(yearSelect, []);
    populateSelect(gradeSelect, []);
  });

  carSelect.addEventListener('change', (e) => {
    const maker = makerSelect.value;
    const car = e.target.value;
    const years = carData.find(m => m.maker === maker)?.cars.find(c => c.name === car)?.years.map(y => y.year) || [];
    populateSelect(yearSelect, years);
    populateSelect(gradeSelect, []);
  });

  yearSelect.addEventListener('change', (e) => {
    const maker = makerSelect.value;
    const car = carSelect.value;
    const year = e.target.value;
    const grades = carData.find(m => m.maker === maker)?.cars.find(c => c.name === car)?.years.find(y => y.year === year)?.grades || [];
    populateSelect(gradeSelect, grades);
  });

  usedSelect.addEventListener('change', (e) => {
    const isUsed = e.target.value;
    if (isUsed === 'yes') {
      usedFields.style.display = 'block';
    } else {
      usedFields.style.display = 'none';
    }
  });
}

async function initPage() {
  await loadCarData();
  initOwnerCarSelection();
  initPurchaseCandidates();
}

window.addEventListener('DOMContentLoaded', initPage);
