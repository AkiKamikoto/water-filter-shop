const carts = document.querySelector('.carts');
const totalprice = document.querySelector('.total-price')
const basketSection = document.querySelector('.basket-section')

const orderButton = document.querySelector("#orderBtn")
const orderForm = document.querySelector(".form")

let emptyBasket = []
let productsData = []
var orderInfo = []
carts.addEventListener("click",deleteProduct)





async function getProducts(){
    try {
        if(!productsData.length){
            const res = await fetch("../data/products.json")
            if(res.ok){
                productsData = await res.json()
            }
            loadProductBasket(productsData)

        }
    } 
    catch{

    }
}

getProducts()

function loadProductBasket(data){

    checkingRelevanceValueBasket(data)
    const basket = getBasketLocalStorage()

    if(!basket || !basket.length){

        //отрисовка элемента пустой корзины
        function renderEmptyBasket(){
            return `

            <div class="container">
                <div class="content">
                    <img src="https://www.mechta.kz/img/empty-basket.6fd7cdbd.png" alt="logotype">
                    <h3>Извините, вы еще не добавили товары в корзину</h3>
                    <p>Вернитесь на главную страницу и добавьте что то</p>
                    <button type="button" class="btn btn-secondary" ><a href="../index.html">На главную</a></button>
                </div>
            </div>

            ` 
        }
        basketSection.insertAdjacentHTML("beforeend",renderEmptyBasket())
        return
    }


    // Фильтруем элементы по айди которые храняться в ЛС
    const findProducts = data.filter(item => basket.includes(String(item.id)));
    orderInfo.push(findProducts)
    if(!findProducts.length){
        
        return
    }
    renderBasketList(findProducts)
}







let orderTitles = []
function renderBasketList(data){
    let totalPrice = 0

    data.forEach(card =>{
        const {id,title,img,price} = card
        totalPrice += Number(price) 
        const cardItem = 
        `
        <div data-product-id="${id}"  class="basket-card">
            <div class="basket-content">
                <div class="basket-image-block">
                    <img class="basket-image" src="../images/item/${img}">
                </div>

                <div class="basket-text-content">
                    <p>${title}</p>
                    <p id="price">Цена: ${price} ₸</p>
                </div>
            </div>
            
            <button type="button" class="btn-close delete_product" aria-label="Close"></button>
        </div>
        `
        orderTitles.push(title)
        carts.insertAdjacentHTML("beforeend",cardItem)
    })
    totalprice.insertAdjacentHTML("beforeend",totalPrice)

    if (data){
        console.log("true")
        orderForm.classList.remove("none")
    }
}

function deleteProduct(event){
    const targetButton = event.target.closest(".delete_product")
    if (!targetButton) return
    const card = targetButton.closest(".basket-card")
    const id = card.dataset.productId
    const basket = getBasketLocalStorage()

    const newBasket = basket.filter(item => item !== id)

    setBasketLocalStorage(newBasket)

    getProducts()
    location.reload();

}

function getBasketLocalStorage() {
    const cartDataJSON = localStorage.getItem('basket');
    return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}

// Запись id товаров в LS
function setBasketLocalStorage(basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
}

// Проверка, существует ли товар указанный в LS 
//(если например пару дней не заходил юзер, а товар, который у него в корзине, уже не существует)
function checkingRelevanceValueBasket(productsData) {
    const basket = getBasketLocalStorage();

    basket.forEach((basketId, index) => {
        const existsInProducts = productsData.some(item => item.id === Number(basketId));
        if (!existsInProducts) {
            basket.splice(index, 1);
        }
    });

    setBasketLocalStorage(basket);
}



const TELEGRAM_CHAT_ID = "@AbsoluteWaterChat"
const TELEGRAM_BOT_TOKKEN = "6483494008:AAHmofDU2xHnvPZ8I_rWrNdwny5HtJnK6Tc"
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKKEN}/sendMessage`

async function sendEmailTelegram(event){
    event.preventDefault()
    const form = event.target

    const {fullName, tel,city,adress,room,comment} = Object.fromEntries(new FormData(form).entries())


    const text = `Новый заказ! \n${fullName}\nТелефон: ${tel}\nАдресс: ${city}, ${adress}, ${room}\nКоментарий к заказу: ${comment ? `${comment}` : "Коментарий отсутствует"}\nЗаказ: \n${orderTitles}`

    try {
        orderButton.textContent = "Отправка"
        const response = await fetch(API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
            })
        });
        if (response.ok){
            form.reset()
            setBasketLocalStorage(emptyBasket)
        } else{
            throw new Erroe(response.statusText)
        }
    } catch (error) {
        console.error(error)
    } finally{
        orderButton.textContent = "Отправить"
    }
}