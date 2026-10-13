// Simple calculator logic
const display = document.getElementById('display');
let current = '';

function updateDisplay(){
  display.value = current || '0';
}

function append(str){
  // prevent multiple leading zeros
  if (current === '0' && str === '0') return;
  current += str;
  updateDisplay();
}

function clearAll(){
  current = '';
  updateDisplay();
}

function backspace(){
  current = current.slice(0, -1);
  updateDisplay();
}

function compute(){
  if(!current) return;
  // sanitize: allow only digits, operators, parentheses, dot, percent and spaces
  const safe = /^[0-9+\-*/(). %]+$/;
  if(!safe.test(current)){
    display.value = 'Error';
    return;
  }

  try{
    // handle percent: replace 'number%' with '(number/100)'
    const expr = current.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    // Evaluate expression
    // Using Function to avoid direct eval call
    const result = Function(`return ${expr}`)();
    current = String(result);
    updateDisplay();
  }catch(e){
    display.value = 'Error';
  }
}

// button handling
document.querySelectorAll('.keys button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const action = btn.getAttribute('data-action');
    const text = btn.textContent.trim();

    if(!action){
      // number or dot
      append(text);
      return;
    }

    if(action === 'clear'){
      clearAll();
      return;
    }

    if(action === 'back'){
      backspace();
      return;
    }

    if(action === 'equals'){
      compute();
      return;
    }

    if(action === 'operator'){
      // allow operator % as percent or other operators
      append(text);
      return;
    }
  });
});

// keyboard support
window.addEventListener('keydown', (e)=>{
  const allowed = '0123456789+-*/().%';
  if(allowed.includes(e.key)){
    append(e.key);
    e.preventDefault();
    return;
  }

  if(e.key === 'Enter' || e.key === '='){
    compute();
    e.preventDefault();
    return;
  }

  if(e.key === 'Backspace'){
    backspace();
    e.preventDefault();
    return;
  }

  if(e.key.toLowerCase() === 'c'){
    clearAll();
    e.preventDefault();
    return;
  }
});

// init
updateDisplay();
