# boardux

[![Run Status](https://api.shippable.com/projects/59838a9be0b1120700a41baa/badge?branch=master)](https://app.shippable.com/github/jpbochi/boardux)

## TODO

### UI

- [x] CLI
- [ ] isometric tic-tac-toe web UI (depends on an http server)

### engine & core

- [ ] introduce referee concept (_authorises_ moves and _lists_ available moves)
- [x] allow for multiple referees to handle GET /moves and each one add their own move links
- [ ] GET view of the game for a given player
- [ ] include available moves in game view
- [ ] ensure every single move is properly authorised
- [ ] consider replacing core:add with core:move & concept of "stash" pieces (outside of board)

### games

- [ ] https://en.wikipedia.org/wiki/Go_(game)
- [ ] "Resta Um" (patience games break the "last player wins" rule in core/score)
- [ ] a partial information game like Stratego
- [ ] a stochastic game (ie, has dice of other random factors): Backgammon
- [ ] a cooperative or team game
- [ ] Scrabble: partial info and stochastic (letters are picked randomly)
- [ ] Chess and some Chess variant (see https://en.wikipedia.org/wiki/List_of_chess_variants)

### extensions

- [x] resign move
- [ ] draw offer
- [ ] standard game state formats like [X-FEN](https://en.wikipedia.org/wiki/X-FEN)

### tic-tac-toe

- [x] list available moves
- [x] authorise moves
- [x] reject /place/an-invalid-piece/a1
- [x] reject /place/x/an-invalid-position
- [x] reject /place/x/an-occupied-position
- [x] /score
- [ ] don't return moves when game is over
