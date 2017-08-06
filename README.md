# boardux

[![Run Status](https://api.shippable.com/projects/59838a9be0b1120700a41baa/badge?branch=master)](https://app.shippable.com/github/jpbochi/boardux)

## TODO

### engine

- [ ] include player in the move requests and `referee` in the action requests
- [ ] introduce referee concept (_authorises_ moves and _lists_ available moves)
- [ ] GET view of the game for a given player
- [ ] include available moves in game view
- [ ] ensure every single move is properly authorised

### games & extensions

- [ ] resign move
- [ ] draw offer
- [ ] a partial information game like Stratego
- [ ] a stochastic game (ie, has dice of other random factors): Backgammon
- [ ] a cooperative or team game
- [ ] Chess and some Chess variant (see https://en.wikipedia.org/wiki/List_of_chess_variants)
- [ ] Scrabble: partial info and stochastic (letters are picked randomly)
- [ ] standard game state formats like [X-FEN](https://en.wikipedia.org/wiki/X-FEN)

### tic-tac-toe

- [ ] list available moves
- [ ] authorise moves
- [ ] reject /place/invalid-piece/a1
- [ ] reject /place/x/invalid-position
- [ ] /score
