# CineScape API/Framework

This framework was design to create ScapeRooms providing a variety of
[puzzles](./puzzle.mjs), forms, popups, counters and other tools that might be useful.

The module definition can be found in the [main.mjs](./main.mjs) file.

```JS
import cinescape from "./[api_path]/puzzle.mjs";
```

## Puzzle

The there is 4 type [puzzles](./puzzle.mjs) that is available to use
such as:

* `PuzzleSelect`: Offers the user 4 options to choose one;
* `PuzzleDrag`: The user is asked to drag boxes and order them;
* `PuzzleRange`: Select a specific number in a range of numbers;
* `PuzzleAsk`: Answer by typing;

### Import the module

The module is located in the [api](.) folders in the file named 
[puzzle.mjs](./puzzle.mjs).

#### Import all the classes individually
```JS
import { 
  PuzzleSelect, 
  PuzzleDrag, 
  PuzzleRange, 
  PuzzleAnswers 
} 
from "./[api_path]/puzzle.mjs";
```
> You can also import other non-essencial classes like `Puzzle` and `PuzzleQuestion`.

#### Import the bundle with the default classes
```JS
import puzzle from "./[api_path]/puzzle.mjs";
```
> By using the default import non-essencial classes won't be included.

#### Import all the bundle
```JS
import * as puzzle from "./[api_path]/puzzle.mjs";
```
> Importing all will also include the non-essencial classe.
