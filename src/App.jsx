import { useEffect, useState } from 'react'
import './App.css'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(() => createNewDice())
  const [tenzies, setTenzies] = useState(false)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld && die)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log('You Won!');
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
    } else {
      setDice(oldDice =>
        oldDice.map(die => die.isHeld ?
          die : generateNewDie()
        )
      )
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
      <h1>Tenzies</h1>
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
