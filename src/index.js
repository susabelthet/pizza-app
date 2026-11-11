import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
 
// ---------- DATA ----------
const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with Italian olive oil and rosemary",
    price: 6,
    photoName: "/pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozzarella",
    price: 10,
    photoName: "/pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozzarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "/pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozzarella, mushrooms, and onion",
    price: 12,
    photoName: "/pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozzarella, and pepperoni",
    price: 15,
    photoName: "/pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozzarella, ham, arugula, and burrata cheese",
    price: 18,
    photoName: "/pizzas/prosciutto.jpg",
    soldOut: false,
  },
];
 
const OPEN_HOUR = 10;
const CLOSE_HOUR = 22;
 
// Re-checks the time every minute so the page flips open/closed without a refresh
function useIsOpen() {
  const [now, setNow] = useState(new Date());
 
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
 
  const hour = now.getHours();
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}
 
// ---------- COMPONENTS ----------
function App() {
  const isOpen = useIsOpen();
 
  return (
    <div className="container">
      <Header isOpen={isOpen} />
      <Menu />
      <Footer isOpen={isOpen} />
    </div>
  );
}
 
function Header({ isOpen }) {
  return (
    <header className="header">
      <h1>SuSabel's Pizza Co.</h1>
      {isOpen && <p className="tagline">Authentic Italian Cuisine</p>}
    </header>
  );
}
 
function Menu() {
  const [query, setQuery] = useState("");
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favourites")) || [];
    } catch {
      return [];
    }
  });
 
  // Remember favourites between visits
  useEffect(() => {
    try {
      localStorage.setItem("favourites", JSON.stringify(favourites));
    } catch {
      /* storage unavailable – favourites just won't persist */
    }
  }, [favourites]);
 
  function toggleFavourite(name) {
    setFavourites((favs) =>
      favs.includes(name) ? favs.filter((f) => f !== name) : [...favs, name]
    );
  }
 
  const search = query.trim().toLowerCase();
  const visiblePizzas = pizzaData.filter(
    (pizza) =>
      (pizza.name.toLowerCase().includes(search) ||
        pizza.ingredients.toLowerCase().includes(search)) &&
      (!showFavsOnly || favourites.includes(pizza.name))
  );
 
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      <p className="menu-intro">
        {pizzaData.length} creative dishes to choose from, all baked in our
        stone oven with organic ingredients.
      </p>
 
      <section className="menu-controls" aria-label="Search and filter pizzas">
        <label htmlFor="search" className="visually-hidden">
          Search pizzas
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search by name or ingredient…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={`btn btn-outline ${showFavsOnly ? "active" : ""}`}
          onClick={() => setShowFavsOnly((s) => !s)}
          aria-pressed={showFavsOnly}
        >
          ♥ Favourites ({favourites.length})
        </button>
      </section>
 
      {visiblePizzas.length > 0 ? (
        <ul className="pizzas">
          {visiblePizzas.map((pizza) => (
            <Pizza
              key={pizza.name}
              name={pizza.name}
              ingredients={pizza.ingredients}
              price={pizza.price}
              photoName={pizza.photoName}
              soldOut={pizza.soldOut}
              isFavourite={favourites.includes(pizza.name)}
              onToggleFavourite={() => toggleFavourite(pizza.name)}
            />
          ))}
        </ul>
      ) : (
        <p className="empty">
          {showFavsOnly && favourites.length === 0
            ? "No favourites yet — tap the ♡ on a pizza to save it."
            : "No pizzas match your search. Try another ingredient!"}
        </p>
      )}
    </main>
  );
}
 
function Pizza({
  name,
  ingredients,
  price,
  photoName,
  soldOut,
  isFavourite,
  onToggleFavourite,
}) {
  return (
    <li className={`pizza ${soldOut ? "sold-out" : ""}`}>
      <img src={photoName} alt={name} />
      <article className="pizza-info">
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <span className="price">{soldOut ? "SOLD OUT" : `$${price}`}</span>
      </article>
      <button
        className={`fav-btn ${isFavourite ? "active" : ""}`}
        onClick={onToggleFavourite}
        aria-pressed={isFavourite}
        aria-label={`${isFavourite ? "Remove" : "Add"} ${name} ${
          isFavourite ? "from" : "to"
        } favourites`}
      >
        {isFavourite ? "♥" : "♡"}
      </button>
    </li>
  );
}
 
function Footer({ isOpen }) {
  return (
    <footer className="footer">
      {isOpen ? (
        <Order closeHour={CLOSE_HOUR} />
      ) : (
        <p>
          Sorry, we're closed. We're happy to welcome you between {OPEN_HOUR}
          :00 and {CLOSE_HOUR}:00.
        </p>
      )}
    </footer>
  );
}
 
function Order({ closeHour }) {
  return (
    <div className="order">
      <p>
        We're currently open until {closeHour}:00. Come visit us or order
        online.
      </p>
      <button
        className="btn"
        onClick={() => alert("Thanks! Online ordering is coming soon 🍕")}
      >
        Order
      </button>
    </div>
  );
}
 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 