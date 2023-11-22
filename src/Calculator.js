import { memo, useState, useEffect, useCallback } from "react";
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);

  const [duration, setDuration] = useState(0);

  /* 
    To fix this issue, you should use the useCallback hook to memoize the playSound function. 
    useCallback will return a memoized version of the function that only changes if one of its dependencies has changed. 
    This way, it won't be considered as a new function on every render, and your useEffect won't re-trigger unnecessarily.

    The concequence to using 'useCallback' is that you need to add 'allowSound' to the dependency array of 'useCallback'.
    This means that 'playSound' will be re-created every time 'allowSound' changes.
    This will cause the 'useEffect' to re-trigger every time 'allowSound' changes as the 'playSound' function will be different (in the dependency array of useEffect).
  */
  // const playSound = useCallback(() => {
  //   if (!allowSound) return;
  //   const sound = new Audio(clickSound);
  //   sound.play();
  // }, [allowSound]); // Dependency array includes allowSound

  // REMINDER: We should have one effect for each side effect
  // HELPFUL TIP: Ask yourself the question of where is it necessary to synchronize state.
  useEffect(() => {
    const newDuration =
      (number * sets * speed) / 60 + (sets - 1) * durationBreak;
    setDuration(newDuration);

    // playSound();
  }, [number, sets, speed, durationBreak]);

  // REMINDER: We should have one effect for each side effect
  // We pass 'duration' in the dependency array of 'useEffect' because we want to re-trigger the effect when 'duration' changes. Esentially, synchronize the two states.
  useEffect(() => {
    const playSound = () => {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    };

    playSound();
  }, [duration, allowSound]);

  // Closure Demonstration
  /*
  // The function inside useEffect has access to the duration variable because of closure.
  // The effect will only run once, when the component mounts, because the dependency array is empty.
  // This is because the duration variable is not in the dependency array.
  useEffect(() => {
    console.log(duration, sets);

    document.title = `Duration: ${duration} | Sets: ${sets}`;
  }, []);

  // When we add 'duration' and 'sets' to the dependency array, the effect will run every time 'duration' and 'sets' changes.
  // So the function in the useEffect will always have access to the latest snapshot of 'duration' and 'sets'.
  useEffect(() => {
    console.log(duration, sets);

    document.title = `Duration: ${duration} | Sets: ${sets}`;
  }, [duration, sets]);
  */

  // Derived state
  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;
  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  function handleNumberChange(e) {
    setNumber(+e.target.value);
  }

  function handleSetsChange(e) {
    setSets(+e.target.value);
  }

  function handleSpeedChange(e) {
    setSpeed(+e.target.value);
  }

  function handleDurationBreakChange(e) {
    setDurationBreak(+e.target.value);
  }

  function handleIncrement() {
    setDuration((prevState) => Math.floor(prevState) + 1);
  }

  function handleDecrement() {
    setDuration((prevState) => (prevState > 1 ? Math.ceil(prevState) - 1 : 0));
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={handleNumberChange}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={handleSetsChange}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={handleSpeedChange}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={handleDurationBreakChange}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDecrement}>-</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleIncrement}>+</button>
      </section>
    </>
  );
}

// If it's some children components that are re-rendering, just because the parent component is re-rendering, then the solution is to memoize those components.
// The memo function only works if the props that are being passed are the same between renders.
export default memo(Calculator);
