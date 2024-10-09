import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  let totalOrder = 0;
  console.log(cart);
  for (let c = 0; c < cart.length; c++) {
    totalOrder += cart[c].price * cart[c].count;
  }

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(
          data.map((e, index) => {
            e.count = 0;
            e.id = index;
            return e;
          })
        );
      });
  }, []);

  function handleResetAll() {
    setCart([]);
    setIsOpenModal(false);
    setProducts(
      products.map((product) => {
        product.count = 0;
        return product;
      })
    );
  }

  return (
    <div className="container">
      <Desserts
        products={products}
        setProducts={setProducts}
        setCart={setCart}
        cart={cart}
      />
      <Cart
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
        setIsOpenModal={setIsOpenModal}
      />
      {isOpenModal && (
        <div className="overlay">
          <div className="modal">
            <img
              src="./assets/images/icon-order-confirmed.svg"
              alt="true"
              style={{ marginBottom: "10px" }}
            ></img>
            <h2 className="heading-title">Order Confirmed</h2>
            <p className="modal_desc">We hope you enjoy your food</p>
            <ul className="modal_items">
              <ItemList
                cart={cart}
                setCart={setCart}
                setProducts={setProducts}
                products={products}
                isOpenModal={isOpenModal}
              />
              <OrderTotal totalOrder={totalOrder} className="modal_total" />
            </ul>
            <Button className="modal_reset_btn" onClick={handleResetAll}>
              Start New Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Cart({ products, setProducts, cart, setCart, setIsOpenModal }) {
  let total = 0;

  let totalOrder = 0;
  for (let c = 0; c < cart.length; c++) {
    totalOrder += cart[c].price * cart[c].count;
  }
  cart.filter((prodcut) => (total += prodcut.count));
  return (
    <div className={`cart ${total === 0 && "cart-empty"}`}>
      <div className="cart_container">
        <h4 className="heading-title-v2">Your Cart ({total})</h4>
        {total === 0 ? (
          <>
            <img
              alt="emty"
              src="./assets/images/illustration-empty-cart.svg"
            ></img>
            <p className="cart_description_empty">
              Your added items will appear here
            </p>
          </>
        ) : (
          <>
            <ul className="cart_items">
              <ItemList
                cart={cart}
                setCart={setCart}
                setProducts={setProducts}
                products={products}
              />
            </ul>
            <OrderTotal totalOrder={totalOrder} className="cart_total" />
            <div className="cart_message">
              <img
                src="./assets/images/icon-carbon-neutral.svg"
                alt="icon-carbon-neutral"
              ></img>
              <p>
                This is a <span>carbon-neutral</span> delivery
              </p>
            </div>
            <Button
              className="cart_confirm_btn"
              onClick={() => setIsOpenModal(true)}
            >
              Confirm Order
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Desserts({ products, setProducts, setCart, cart }) {
  return (
    <div className="desserts">
      <h1 className="heading-title">Desserts</h1>
      <div className="deserts_container">
        {products.map((el, index) => (
          <DessertBox
            key={el.name}
            el={el}
            products={products}
            index={index}
            setProducts={setProducts}
            setCart={setCart}
            cart={cart}
          />
        ))}
      </div>
    </div>
  );
}

function DessertBox({ el, index, products, setProducts, setCart, cart }) {
  let currentProduct = products[index];
  let amount = currentProduct.count;

  function updateProductCount(index, amountChange) {
    setProducts(
      products.map((product, i) => {
        if (i === index) {
          product.count += amountChange;
        }
        return product;
      })
    );

    // تحديث الـ cart
    const currentProduct = products[index];
    const indexInArray = cart.findIndex(
      (item) => item.id === currentProduct.id
    );

    if (indexInArray === -1 && amountChange > 0) {
      setCart([
        ...cart,
        {
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          count: currentProduct.count,
          image: currentProduct.image,
        },
      ]);
    } else if (indexInArray !== -1) {
      const updatedCart = cart
        .map((e, i) => {
          if (i === indexInArray) e.count = currentProduct.count;
          return e;
        })
        .filter((e) => e.count !== 0);

      setCart(updatedCart);
    }
  }

  function handleIncrement() {
    updateProductCount(index, 1);
  }

  function handleDecrement() {
    updateProductCount(index, -1);
  }

  return (
    <div className="desert-box">
      <div className={`desert_image`}>
        <img
          src={`${el.image.desktop}`}
          className={amount > 0 ? "selected" : ""}
          alt={el.name}
        ></img>
      </div>
      {amount === 0 ? (
        <Button
          className="btn-empty"
          onClick={() => {
            setProducts(
              products.map((product, i) => {
                if (i === index) {
                  product.count = 1;
                }
                return product;
              })
            );
            if (cart.length === 0)
              setCart([
                ...cart,
                {
                  id: currentProduct.id,
                  name: el.name,
                  price: el.price,
                  count: el.count,
                  image: el.image,
                },
              ]);
            cart.map((items, index) => {
              if (items.id !== currentProduct.id) {
                setCart([
                  ...cart,
                  {
                    id: currentProduct.id,
                    name: el.name,
                    price: el.price,
                    count: el.count,
                    image: el.image,
                  },
                ]);
              } else {
                items.count = el.count;
                setCart([...cart]);
              }
            });
          }}
        >
          <img
            className={`add-to-cart`}
            src="./assets/images/icon-add-to-cart.svg"
            alt="add to cart"
          ></img>
          <span>Add To Cart</span>
        </Button>
      ) : (
        <div className="btn-not-empty">
          <div className="svg-container" onClick={handleDecrement}>
            <img
              src="./assets/images/icon-decrement-quantity.svg"
              alt="decrement"
              style={{ width: "10px" }}
            ></img>
          </div>

          <span>{amount}</span>
          <div className="svg-container" onClick={handleIncrement}>
            <img
              src="./assets/images/icon-increment-quantity.svg"
              alt="increment"
              style={{ width: "10px" }}
            ></img>
          </div>
        </div>
      )}
      <div className="desert_description">
        <p className="description_category">{el.category}</p>
        <h3 className="description_name">{el.name}</h3>
        <p className="description_price">${el.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

function Button({ children, className, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function ItemList({ cart, setCart, setProducts, products, isOpenModal }) {
  function handleRemove(id) {
    setCart(cart.filter((el) => el.id !== id));
    setProducts(
      products.map((product, i) => {
        if (i === id) {
          product.count = 0;
        }
        return product;
      })
    );
  }

  return (
    <>
      {cart.map((product) => (
        <li id={`item-${product.id}`} key={product.name}>
          <div className="left">
            {isOpenModal && (
              <img src={product.image.thumbnail} alt={product.name}></img>
            )}
            <div>
              <p className="product_title">{product.name}</p>
              <p>
                <span>{product.count}x</span>
                <span>@{product.price}</span>
                {!isOpenModal && <span>${product.count * product.price}</span>}
              </p>
            </div>
          </div>
          <div className="right">
            {!isOpenModal && (
              <div
                className="svg-container"
                onClick={() => handleRemove(product.id)}
              >
                <img src="./assets/images/icon-remove-item.svg" alt="remove" />
              </div>
            )}
            {isOpenModal && <span>${product.count * product.price}</span>}
          </div>
        </li>
      ))}
    </>
  );
}

function OrderTotal({ totalOrder, className }) {
  return (
    <div className={className}>
      <p className="left">Order Total</p>
      <h3 className="right">${totalOrder}</h3>
    </div>
  );
}

export default App;
