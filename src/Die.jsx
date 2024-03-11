/* eslint-disable react/prop-types */

export default function Die(props) {

  return (
    <div
      className={`die-face ${props.isHeld ? 'held' : ""}`}
      onClick={props.holdDice}
    >
      <div className={`${props.value >= 1 && 'd1'}`}></div>
      <div className={`${props.value >= 2 && 'd2'}`}></div>
      <div className={`${props.value >= 3 && 'd3'}`}></div>
      <div className={`${props.value >= 4 && 'd4'}`}></div>
      <div className={`${props.value >= 5 && 'd5'}`}></div>
      <div className={`${props.value === 6 && 'd6'}`}></div>
    </div>
  )
}
