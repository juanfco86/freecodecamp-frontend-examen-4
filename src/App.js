import { useState } from 'react';
import './App.css';
import { create, all } from 'mathjs';

function App() {
  const [display, setDisplay] = useState('0')
  const [display2, setDisplay2] = useState('0')
  const [firstOperand, setFirstOperand] = useState(null);
  const [secondOperand, setSecondOperand] = useState(false);
  const [decimal, setDecimal] = useState(false);
  const [lastOperator, setLastOperator] = useState(null)
  const math = create(all);

  const handleClickNum = (num) => {
    if (display === '0' || secondOperand) {
      setDisplay(num)
      setDisplay2(num)
      setSecondOperand(false)
      setDecimal(false)
    } else {
      if (decimal) {
        setDisplay(display + num)
        setDisplay2(display2 + num)
        setDecimal(false)
      } else {
        setDisplay(display + num)
        setDisplay2(display2 + num)
      }
    }
  }

  const handleClickOp = (operator) => {
    if (operator === '=') {
      const result = calculate();
      setDisplay2(result.toString());
      setDisplay('0');
      setFirstOperand(result)
      setSecondOperand(false);
      setDecimal(false)
      setLastOperator(null)
    } else {
      if (firstOperand !== null) {
        setDisplay(firstOperand.toString() + ' ' + operator);
        setFirstOperand(null)
        setSecondOperand(false);
        setDecimal(false);

      } else if (operator === '=' && lastOperator && lastOperator === '-' && operator !== '-') {
        setDisplay((prevDisplay) => prevDisplay.slice(0, -2) + operator)

      } else {
        setDisplay((prevDisplay) => prevDisplay + operator);
      }
      setDisplay2('');
      setSecondOperand(false);
      setDecimal(false)
      setLastOperator(operator)
    }
  };


  const calculate = () => {
    try {
      const sanitizedExpression = display.replace(/(\s+|\*\s+|\+\s+|\s+|\/\s+)/g, '');
      const operatorSequenceFixed = sanitizedExpression.replace(/([+\-*])+/g, (match) => {
        if (match.length > 1) {
          const lastOperator = match[match.length - 1];
          const prevOperatorIndex = match.lastIndexOf(lastOperator, match.length - 2);
          if (prevOperatorIndex === -1 && lastOperator !== '-') {
            return lastOperator;
          }
        }
        return match;
      });
      const result = math.evaluate(operatorSequenceFixed);
      const parsedResult = parseFloat(result);
      const decimalCount = (parsedResult % 1 !== 0) ? parsedResult.toString().split('.')[1].length : 0;
      const decimalPrecision = Math.min(decimalCount, 4);
      return parsedResult.toFixed(decimalPrecision);
    } catch (error) {
      return 'Error';
    }
  };

  const handleClickDecimal = () => {
    if (!display2.includes('.') && (!secondOperand || (secondOperand && !decimal))) {
      setDisplay(display + '.');
      setDisplay2(display + '.');
      setSecondOperand(false)
      setDecimal(true)
    }
  }

  const handleClickClear = () => {
    setDisplay('0');
    setDisplay2('0');
    setFirstOperand(null);
    setSecondOperand(false);
  }

  return (
    <>
      <div className='calc--container'>
        <div className='display--container'>
          <div id="display2">{ display }</div>
          <div id="display">{ display2 }</div>
        </div>
        <div className='calc--keys'>
          <button id="seven" className='number--keys' onClick={ () => handleClickNum('7') } tabIndex='0'>7</button>
          <button id="eight" className='number--keys' onClick={ () => handleClickNum('8') }>8</button>
          <button id="nine" className='number--keys' onClick={ () => handleClickNum('9') }>9</button>
          <button id="add" className='operation--keys' onClick={ () => handleClickOp('+') }>+</button>
          <button id="four" className='number--keys' onClick={ () => handleClickNum('4') }>4</button>
          <button id="five" className='number--keys' onClick={ () => handleClickNum('5') }>5</button>
          <button id="six" className='number--keys' onClick={ () => handleClickNum('6') }>6</button>
          <button id="subtract" className='operation--keys' onClick={ () => handleClickOp('-') }>-</button>
          <button id="one" className='number--keys' onClick={ () => handleClickNum('1') }>1</button>
          <button id="two" className='number--keys' onClick={ () => handleClickNum('2') }>2</button>
          <button id="three" className='number--keys' onClick={ () => handleClickNum('3') }>3</button>
          <button id="multiply" className='operation--keys' onClick={ () => handleClickOp('*') }>*</button>
          <button id="clear" className='clear--key' onClick={ handleClickClear }>Clear</button>
          <button id="zero" className='number--keys' onClick={ () => handleClickNum('0') }>0</button>
          <button id="decimal" className='operation--keys' onClick={ handleClickDecimal }>.</button>
          <button id="divide" className='operation--keys' onClick={ () => handleClickOp('/') }>/</button>
        </div>
        <button id="equals" className='equal--key' onClick={ () => handleClickOp('=') }> = </button>
      </div>
    </>
  );
}

export default App;
