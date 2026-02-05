const conversionData = {
    length: {
        units: {
            mètre: { factor: 1, symbol: 'm' },
            kilomètre: { factor: 0.001, symbol: 'km' },
            centimètre: { factor: 100, symbol: 'cm' },
            millimètre: { factor: 1000, symbol: 'mm' },
            mile: { factor: 0.000621371, symbol: 'mi' },
            yard: { factor: 1.09361, symbol: 'yd' },
            pied: { factor: 3.28084, symbol: 'ft' },
            pouce: { factor: 39.3701, symbol: 'in' }
        }
    },
    weight: {
        units: {
            kilogramme: { factor: 1, symbol: 'kg' },
            gramme: { factor: 1000, symbol: 'g' },
            milligramme: { factor: 1000000, symbol: 'mg' },
            tonne: { factor: 0.001, symbol: 't' },
            livre: { factor: 2.20462, symbol: 'lb' },
            once: { factor: 35.274, symbol: 'oz' }
        }
    },
    temperature: {
        units: {
            celsius: { factor: 1, symbol: '°C' },
            fahrenheit: { factor: 1, symbol: '°F' },
            kelvin: { factor: 1, symbol: 'K' }
        },
        specialConversion: true
    },
    volume: {
        units: {
            litre: { factor: 1, symbol: 'L' },
            millilitre: { factor: 1000, symbol: 'mL' },
            mètre_cube: { factor: 0.001, symbol: 'm³' },
            centimètre_cube: { factor: 1000, symbol: 'cm³' },
            gallon: { factor: 0.264172, symbol: 'gal' },
            pinte: { factor: 2.11338, symbol: 'pt' }
        }
    },
    area: {
        units: {
            mètre_carré: { factor: 1, symbol: 'm²' },
            kilomètre_carré: { factor: 0.000001, symbol: 'km²' },
            centimètre_carré: { factor: 10000, symbol: 'cm²' },
            hectare: { factor: 0.0001, symbol: 'ha' },
            pied_carré: { factor: 10.7639, symbol: 'ft²' }
        }
    },
    speed: {
        units: {
            mètre_seconde: { factor: 1, symbol: 'm/s' },
            kilomètre_heure: { factor: 3.6, symbol: 'km/h' },
            mille_heure: { factor: 2.23694, symbol: 'mph' },
            nœud: { factor: 1.94384, symbol: 'kn' }
        }
    }
};

const conversionTypeSelect = document.getElementById('conversionType');
const unitsContainer = document.getElementById('unitsContainer');
const inputValue = document.getElementById('inputValue');
const convertBtn = document.querySelector('.convert-btn');
const resultContainer = document.getElementById('resultContainer');
const resultValue = document.getElementById('resultValue');
const errorMessage = document.getElementById('errorMessage');
const converterForm = document.getElementById('converterForm');

let currentConversionType = '';
let fromUnit = '';
let toUnit = '';

document.addEventListener('DOMContentLoaded', () => {
    conversionTypeSelect.addEventListener('change', handleConversionTypeChange);
    inputValue.addEventListener('input', handleInputChange);
    converterForm.addEventListener('submit', handleFormSubmit);
});

function handleConversionTypeChange(e) {
    currentConversionType = e.target.value;
    
    if (!currentConversionType) {
        unitsContainer.innerHTML = '';
        convertBtn.disabled = true;
        resultContainer.classList.add('hidden');
        return;
    }
    
    createUnitSelectors();
    convertBtn.disabled = false;
    resultContainer.classList.add('hidden');
}

function createUnitSelectors() {
    const units = Object.keys(conversionData[currentConversionType].units);
    
    unitsContainer.innerHTML = `
        <div class="unit-group">
            <label for="fromUnit" class="form-label">De</label>
            <select id="fromUnit" name="fromUnit" class="form-select" required>
                ${units.map(unit => `<option value="${unit}">${unit} (${conversionData[currentConversionType].units[unit].symbol})</option>`).join('')}
            </select>
        </div>
        <div class="unit-group">
            <label for="toUnit" class="form-label">Vers</label>
            <select id="toUnit" name="toUnit" class="form-select" required>
                ${units.map(unit => `<option value="${unit}">${unit} (${conversionData[currentConversionType].units[unit].symbol})</option>`).join('')}
            </select>
        </div>
    `;
    
    document.getElementById('fromUnit').addEventListener('change', handleUnitChange);
    document.getElementById('toUnit').addEventListener('change', handleUnitChange);
    
    fromUnit = units[0];
    toUnit = units[1] || units[0];
}

function handleUnitChange() {
    fromUnit = document.getElementById('fromUnit').value;
    toUnit = document.getElementById('toUnit').value;
    
    resultContainer.classList.add('hidden');
    errorMessage.textContent = '';
    
    if (inputValue.value) {
        performConversion();
    }
}

function handleInputChange() {
    errorMessage.textContent = '';
    
    if (inputValue.value && fromUnit && toUnit) {
        performConversion();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    performConversion();
}

function performConversion() {
    const value = parseFloat(inputValue.value);
    
    if (isNaN(value)) {
        showError('Veuillez entrer un nombre valide');
        return;
    }
    
    if (value < 0 && currentConversionType === 'temperature') {
        showError('La température ne peut pas être négative pour cette conversion');
        return;
    }
    
    let result;
    
    if (conversionData[currentConversionType].specialConversion) {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        result = convertStandard(value, fromUnit, toUnit, currentConversionType);
    }
    
    displayResult(value, result);
}

function convertStandard(value, from, to, type) {
    const fromFactor = conversionData[type].units[from].factor;
    const toFactor = conversionData[type].units[to].factor;
    
    const baseValue = value / fromFactor;
    const result = baseValue * toFactor;
    
    return result;
}

function convertTemperature(value, from, to) {
    let celsius;
    
    switch (from) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }
    
    switch (to) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9/5 + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

function displayResult(originalValue, convertedValue) {
    const fromSymbol = conversionData[currentConversionType].units[fromUnit].symbol;
    const toSymbol = conversionData[currentConversionType].units[toUnit].symbol;
    
    const formattedOriginal = formatNumber(originalValue);
    const formattedResult = formatNumber(convertedValue);
    
    resultValue.innerHTML = `
        <div class="result-conversion">
            <span class="original-value">${formattedOriginal} ${fromSymbol}</span>
            <span class="equals">=</span>
            <span class="converted-value">${formattedResult} ${toSymbol}</span>
        </div>
    `;
    
    resultContainer.classList.remove('hidden');
}

function formatNumber(num) {
    if (Math.abs(num) >= 1000000) {
        return num.toExponential(3);
    } else if (Math.abs(num) >= 1000) {
        return num.toFixed(2);
    } else if (Math.abs(num) >= 1) {
        return num.toFixed(4);
    } else {
        return num.toFixed(6);
    }
}

function showError(message) {
    errorMessage.textContent = message;
    resultContainer.classList.add('hidden');
}
