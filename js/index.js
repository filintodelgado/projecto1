import { Timer } from "../api/timer.mjs";

const timer = new Timer(3, true);

const callback = (timer) => {
  console.log("working")
}

timer.addBreakingPoint(2, callback)