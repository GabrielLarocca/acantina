# A cantina

- This project is being developed for the 4th year of software engineering in the discipline of 'Information Systems Design', for a real client.
- Consists of a customer frontend, where you can login, register, add products to cart and place an order, which can be paid by cash or card in the PWA itself.
- Consists of a administrator frontend, where you can list, create edit and delete products, users and coupons, and track orders in progress or already completed.

## :wrench: Setup

- In the backend folder, run `npm install`, `composer install`,`cp .env.example .env`, after, generate the laravel key `php artisan key:generate` and change the database information in `.env` and run the server with `php artisan serve`;

- In the frontend_admin folder, run `npm install` and run the server with `npm start`;

- In the frontend folder, run `npm install` and run the server with `npm run dev`;

## 📷 Gallery

###### administrator frontend

<p>Login screen on Desktop</p>

![Login screen](../assets/images/admin/loginScreenD.png "Login screen on Desktop")

<p>Login screen on Mobile</p>

![Login screen](../assets/images/admin/loginScreenM.png "Login screen on Mobile")

<p>Products screen</p>

![Products screen](../assets/images/admin/produtosScreen.png "Products Screen")

###### customer frontend

<p>initial screen</p>

![initial screen](../assets/images/customer/initial.png "Initial screen")

<p>Cart screen</p>

![cart screen](../assets/images/customer/cart.png "Cart screen")

<p>Products screen</p>

![Products screen](../assets/images/customer/listProdutos.png "Products Screen")

<p>Menu screen</p>

![Menu screen](../assets/images/customer/menu.png "Menu Screen")

<p>Product screen</p>

![Product screen](../assets/images/customer/product.png "Product Screen")

## 👨‍💻 Technologies

- Laravel v8
- React v18
- Next.js v12

## ⚠️ Figma

The project design was developed by <a href="https://github.com/pbatistads" target="_blank">Poliana Batista</a> and you can find it <a href="https://www.figma.com/file/L97JW1ujZMOe6fhsJpNXIl/Projeto---SGPAC?node-id=0%3A1" target="_blank">here</a>.
