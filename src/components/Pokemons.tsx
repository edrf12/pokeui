import { Card, Pagination } from "react-bootstrap";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import placeholder from "/pokemon-silhouette.png";

function normalizeName(name: string): string {
  const split = name.split("-");

  if (name.includes("-") && split[0].length > 2) {
    let finalString = "";

    for (let i = 0; i < split.length; i++) {
      const element = split[i] == "of" ? split[i] : split[i].charAt(0).toUpperCase() + split[i].slice(1);

      if (i == 0) {
        finalString += element + " (";
      } else if (i == split.length - 1) {
        finalString += element + ")";
      } else {
        finalString += element + " ";
      }
    }

    return finalString;
  } else if (name.includes("-")) {
    switch (split[0]) {
      case "mr":
        if (split[2]) {
          return (
            // Mr. Mime (Galar) :/
            "Mr. " +
            split[1].charAt(0).toUpperCase() +
            split[1].slice(1) +
            " (" +
            split[2].charAt(0).toUpperCase() +
            split[2].slice(1) +
            ")"
          );
        }

        return "Mr. " + split[1].charAt(0).toUpperCase() + split[1].slice(1); // Mr. Mime & Mr. Rime
      case "ho":
        return "Ho-oh";
    }
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function Pokemons() {
  // Pokemon State
  const [pokemonCache, setPokemonCache] = useLocalStorage<{ name: string; url: string }[]>("POKEAPI_POKEMONS", [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  ]);
  const [pokemons, setPokemons] = useState<JSX.Element[] | null>(null);
  const [pokecount, setPokecount] = useState<number>(0);

  // Pagination State
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  // TODO: Implement some way to save the page we are at

  // Build the pokemon cards and cache the data
  useEffect(() => {
    console.log(pokecount, limit, offset, Math.ceil(pokecount / limit));
    if (pokemonCache.length === 1 || pokemonCache.length === 0) {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=1")
        .then((response) => response.json())
        .then((data) => {
          setPokecount(data.count);
          fetch(`https://pokeapi.co/api/v2/pokemon?limit=${data.count}`)
            .then((response) => response.json())
            .then((data) => setPokemonCache(data.results));
        });
    }

    if (pokecount === 0) {
      setPokecount(pokemonCache.length);
    }

    if (pokemonCache.length > 0) {
      const pokemonCards = pokemonCache
        .map((pokemon, key) => {
          // TODO: Implement search (will probably go here)
          if (key >= offset && key < offset + limit) {
            return (
              // TODO: Add LINK to the pokemon page
              <Card key={pokemon.name} style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.substring(34, pokemon.url.length - 1)}.png`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholder;
                  }}
                />
                <Card.Body>
                  <Card.Title>{normalizeName(pokemon.name)}</Card.Title>
                  {/* TODO: Add more information about the pokemon */}
                </Card.Body>
              </Card>
            );
          }
          return undefined;
        })
        .filter(Boolean) as JSX.Element[];

      setPokemons(pokemonCards);
    }
  }, [pokemonCache, setPokemonCache, limit, offset, pokecount]);

  // Build the pagination
  const pages = (
    <div className="pages-div">
      <Pagination>
        <Pagination.First
          onClick={() => {
            setOffset(0);
          }}
        />
        {offset / limit - 1 > 0 ? (
          <Pagination.Item
            onClick={() => {
              if (offset - 2 * limit >= 0) {
                setOffset(offset - limit);
              }
            }}
          >
            {Math.ceil(offset / limit) - 1}
          </Pagination.Item>
        ) : null}
        {offset / limit > 0 ? (
          <Pagination.Item
            onClick={() => {
              if (offset - limit >= 0) {
                setOffset(offset - limit);
              }
            }}
          >
            {Math.ceil(offset / limit)}
          </Pagination.Item>
        ) : null}
        <Pagination.Item active>{Math.ceil(offset / limit + 1)}</Pagination.Item>
        {offset / limit + 2 <= Math.ceil(pokecount / limit) ? (
          <Pagination.Item
            onClick={() => {
              if (offset + limit < pokecount) {
                setOffset(offset + limit);
              }
            }}
          >
            {Math.ceil(offset / limit + 2)}
          </Pagination.Item>
        ) : null}
        {offset / limit + 3 <= Math.ceil(pokecount / limit) ? (
          <Pagination.Item
            onClick={() => {
              if (offset + limit < pokecount) {
                setOffset(offset + limit);
              }
            }}
          >
            {Math.ceil(offset / limit + 3)}
          </Pagination.Item>
        ) : null}
        <Pagination.Last
          onClick={() => {
            setOffset(Math.ceil(pokecount / limit) * limit - limit);
          }}
        />
      </Pagination>
    </div>
  );

  return (
    <>
      {pages}
      {/* TODO: Implement a way to change the limit of pokemons per page */}

      <div className="pokemon-cards">{pokemons}</div>

      {pages}
    </>
  );
}
