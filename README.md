# boardux

[![Run Status](https://api.shippable.com/projects/59838a9be0b1120700a41baa/badge?branch=master)](https://app.shippable.com/github/jpbochi/boardux)

## TODO

### engine

- [ ] introduce referee concept (_authorises_ moves and _lists_ available moves)
- [ ] allow for multiple referees to handle GET /moves and each one add their own move links
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

- [x] list available moves
- [x] authorise moves
- [x] reject /place/an-invalid-piece/a1
- [x] reject /place/x/an-invalid-position
- [ ] reject /place/x/an-occupied-position
- [ ] /score
