import { useEffect, useMemo, useState } from "react";
import Calculator from "./Calculator";
import ToggleSounds from "./ToggleSounds";

function formatTime(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function App() {
  const [allowSound, setAllowSound] = useState(true);
  const [time, setTime] = useState(formatTime(new Date()));

  // Will be be AM or PM
  const partOfDay = time.slice(-2);

  /* 
    Why do we use 'useMemo' here?
      We use 'useMemo' and not 'useCallback' because we're not passing a function to the child component, but an array of objects.

      The workouts array is recalculated every time App renders, which includes every second due to the setInterval updating time. 
      To fix this, you can use useMemo to memoize the workouts array. 
      This way, it will only be recalculated when partOfDay changes.
      This change will prevent Calculator from re-rendering every second, as it will only receive a new workouts prop when partOfDay changes (i.e., from AM to PM or vice versa).
  */
  const workouts = useMemo(
    () => [
      {
        name: "Full-body workout",
        numExercises: partOfDay === "AM" ? 9 : 8,
      },
      {
        name: "Arms + Legs",
        numExercises: 6,
      },
      {
        name: "Arms only",
        numExercises: 3,
      },
      {
        name: "Legs only",
        numExercises: 4,
      },
      {
        name: "Core only",
        numExercises: partOfDay === "AM" ? 5 : 4,
      },
    ],
    [partOfDay] // We pass partOfDay as a dependency to useMemo so that the workouts array is recalculated when partOfDay changes.
  );

  // This function doesn't contain any reactive state, so it doesn't need to be re-rendered each time the App component re-renders.
  /*
  function formatTime(date) {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }
  */

  // useEffect(function () {
  //   const id = setInterval(function () {
  //     setTime(formatTime(new Date()));
  //   }, 1000);

  //   // Cleanup function
  //   return () => clearInterval(id);
  // }, []);

  // Remember: When the App component re-renders, its child components re-render too.
  return (
    <main>
      <h1>Workout timer</h1>
      <time>For your workout on {time}</time>
      <ToggleSounds allowSound={allowSound} setAllowSound={setAllowSound} />
      <Calculator workouts={workouts} allowSound={allowSound} />
    </main>
  );
}

export default App;
