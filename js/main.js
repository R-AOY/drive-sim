async function loadCarModels() {
  const response = await fetch('/drive-sim/js/car-models.json');
  const carModels = await response.json();
  return carModels;
}

function createCarSelectors(prefix, containerId, carModels) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // クリア

  const makerSelect = document.createElement('select');
  const modelSelect = document.createElement('select');
  const yearSelect = document.createElement('select');
  const gradeSelect = document.createElement('select');

  makerSelect.innerHTML = '<option value="">メーカーを選択</option>';
  Object.keys(carModels).forEach(maker => {
    const option = document.createElement('option');
    option.value = maker;
    option.textContent = maker;
    makerSelect.appendChild(option);
  });

  makerSelect.addEventListener('change', () => {
    modelSelect.innerHTML = '<option value="">車種を選択</option>';
    yearSelect.innerHTML = '<option value="">年式を選択</option>';
    gradeSelect.innerHTML = '<option value="">グレードを選択</option>';
    if (carModels[makerSelect.value]) {
      Object.keys(carModels[makerSelect.value]).forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });

  modelSelect.addEventListener('change', () => {
    yearSelect.innerHTML = '<option value="">年式を選択</option>';
    gradeSelect.innerHTML = '<option value="">グレードを選択</option>';
    if (carModels[makerSelect.value] && carModels[makerSelect.value][modelSelect.value]) {
      Object.keys(carModels[makerSelect.value][modelSelect.value]).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }
  });

  yearSelect.addEventListener('change', () => {
    gradeSelect.innerHTML = '<option value="">グレードを選択</option>';
    if (carModels[makerSelect.value] && carModels[makerSelect.value][modelSelect.value] && carModels[makerSelect.value][modelSelect.value][yearSelect.value]) {
      carModels[makerSelect.value][modelSelect.value][yearSelect.value].forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        gradeSelect.appendChild(option);
      });
    }
  });

  container.appendChild(makerSelect);
  container.appendChild(modelSelect);
  container.appendChild(yearSelect);
  container.appendChild(gradeSelect);
}

document.addEventListener('DOMContentLoaded', async () => {
  const carModels = await loadCarModels();

  const hasOwnedCar = document.getElementById('hasOwnedCar');
  const ownedCarFields = document.getElementById('owned-car-fields');

  hasOwnedCar.addEventListener('change', () => {
    if (hasOwnedCar.value === 'yes') {
      ownedCarFields.style.display = 'block';
      createCarSelectors('owned', 'owned-car-selectors', carModels);
    } else {
      ownedCarFields.style.display = 'none';
      document.getElementById('owned-car-selectors').innerHTML = '';
    }
  });

  const addCandidateBtn = document.getElementById('add-candidate');
  const candidateList = document.getElementById('candidate-list');

  addCandidateBtn.addEventListener('click', () => {
    const candidateDiv = document.createElement('div');
    candidateDiv.className = 'candidate';

    const mileageLabel = document.createElement('label');
    mileageLabel.innerHTML = '走行距離（km）: <input type="number" class="candidate-mileage">';

    const selectorsDiv = document.createElement('div');
    candidateDiv.appendChild(selectorsDiv);
    candidateDiv.appendChild(mileageLabel);

    candidateList.appendChild(candidateDiv);

    createCarSelectors('candidate', selectorsDiv.id = `selectors-${candidateList.children.length}`, carModels);
  });
});
