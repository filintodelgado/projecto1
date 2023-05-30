import { Timer } from "../api/main.mjs"

const timer = new Timer(10)

timer.addEventListener("start", () => { console.log("started") })
timer.addBreakingPoint(5, (eventData) => {
  console.log(`Event trigged at ${eventData.type} seconds.`)
})

timer.start();

timer.addEventListener("pause")