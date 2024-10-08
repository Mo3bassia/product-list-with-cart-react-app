import { useEffect, useState } from "react";

function App() {
  return (
    <div className="container">
      <Desserts />
    </div>
  );
}

function Desserts() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div className="desserts">
      <h1 className="heading-title">Desserts</h1>
      <div className="deserts_container">
        {data.map((el) => (
          <DessertBox key={el.name} el={el} />
        ))}
      </div>
    </div>
  );
}

function DessertBox({ el }) {
  return (
    <div className="desert-box">
      <div className="desert_image">
        <img src={`${el.image.desktop}`} alt={el.name}></img>
      </div>
      <Button className="btn-empty">
        <i className="fa-solid fa-cart-shopping"></i> <span> Add To Cart</span>
      </Button>
      <div className="desert_description">
        <p className="description_category">{el.category}</p>
        <h3 className="description_name">{el.name}</h3>
        <p className="description_price">${el.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

function Button({ children, className }) {
  return <button className={className}>{children}</button>;
}

export default App;
