import { useEffect, useState } from 'react'
import './App.css'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(() => createNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [rollCount, setRollCount] = useState(1)

  useEffect(() => {
    const cleanUp = setInterval(() => {
      setSeconds(prevSecs => prevSecs + 1)
    }, 1000)

    if (tenzies) {
      clearInterval(cleanUp)
    }

    return () => clearInterval(cleanUp)

    // strict mode in main.jsx renders our App 
    // component twice and to stop the effect of 2 intervals running simultaneously and updating the seconds 
    // by 2 everytime, we need to clear our interval through a cleanup function inside useEffect because our  
    // component unmounts and re-renders in the case of strict mode 
    
  }, [tenzies])

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld && die)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  // This function creates a new array containing dice values
  function createNewDice() {
    const newDices = []
    for (let i = 0; i < 10; i++) {
      newDices.push(generateNewDie())
    }
    return newDices
  }

  // This function helps rolls the die for which isHeld is false and helps stop the die for which isHeld is true
  function rollDice() {
    if (tenzies) {
      setDice(createNewDice())
      setTenzies(false)
      setSeconds(0)
    } else {
      setDice(oldDice =>
        oldDice.map(die => die.isHeld ?
          die : generateNewDie()
        )
      )
      setRollCount(prevCount => prevCount + 1)
    }
  }

  // This function stops the rolling of the clicked die
  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => die.id === id ?
        { ...die, isHeld: !die.isHeld } : die
      )
    )
  }

  //Creating 10 Dice
  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />))

  return (
    <main>
      {tenzies && <Confetti />}
      <div className="time-container">
        <div>
        {`${Math.floor(seconds / 60) <= 9 ?
          "0" + Math.floor(seconds / 60) :
          Math.floor(seconds / 60)}:
          ${seconds % 60 <= 9 ?
          "0" + (seconds % 60) : 
          (seconds % 60)}`}
        </div>
        <div>
          {`Rolls:${rollCount}`}
        </div>
      </div>
      <h1 className='title'>Tenzies</h1>
      <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className='roll-dice'
        onClick={rollDice}
      >
        {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  )
}

export default App
