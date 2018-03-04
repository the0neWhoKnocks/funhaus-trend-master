# Funhaus Trend Master

A game-ified version of Funhaus' web series.

---

## Installation

```sh
yarn
```

---

## Usage

```sh
# Build & Start the server
yarn build
yarn start
```

You can then use the nav via a mouse to navigate, or `CTRL+LEFT` or `CTRL+RIGHT`
on your keyboard.

---

## Development

```sh
# Run these commands in separate terminals
yarn build --dev # terminal 1
yarn start --dev # terminal 2
# OR
yarn build -d # terminal 1
yarn start -d # terminal 2

# view help
yarn start --help
# build command doesn't have a help since WebPack will override it

# Lint
yarn test
```

You can go through the app without having to set up any data by adding this to
the URL `?onRails`.

You can also test out specific views by adding a query param of `?view=<TYPE>`.
The available types are:
- `enterTerms`
- `finalScore`
- `term`
- `termResults`
