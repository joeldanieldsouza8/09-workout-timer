import { memo } from "react";

function ToggleSounds({ allowSound, setAllowSound }) {
  function handleToggleSound() {
    setAllowSound((allow) => !allow);
  }

  return (
    <button
      className="btn-sound"
      onClick={handleToggleSound}
    >
      {allowSound ? "🔈" : "🔇"}
    </button>
  );
}

// If it's some children components that are re-rendering, just because the parent component is re-rendering, then the solution is to memoize those components.
// The memo function only works if the props that are being passed are the same between renders.
export default memo(ToggleSounds);
