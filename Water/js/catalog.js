const cards = document.querySelector(".cards")
let productsData = [];

getProducts()

async function getProducts(){
    try{
        if(!productsData.length){
            const res = await fetch("../data/products.json")
            productsData = await res.json();
        }

        createCards(productsData)

        checkingRelevanceValueBasket(productsData)

        const basket = getBasketLocalStorage()
        chekingActivateBasket(basket);
    } catch{

    }

}

//Рендер карточек//


function createCards(data){
    data.forEach(card => {
        const {id,img,title,price} = card;
        const cardItem =
        `
        <div class="card"  data-product-id="${id}">
        <div class="card_top">
            <a href="/card.html?id=${id}" class="card__image">
                <img
                class="image"
                src="../images/item/${img}"
                alt="${title}"
            </a>
        </div>
        <div class="card_bottom">
            <a href="/card.html?id=${id}" class="card_title">${title}</a>
            <div class="card_price card__price--common">${price} ₸</div>
            <button type="button" class="btn btn-primary card_add">В корзину</button>
        </div>
    </div>
        `
        cards.insertAdjacentHTML("beforeend",cardItem)
    })
}

cards.onclick = function(event){
    
    const targetButton = event.target.closest(".card_add")
    if(!targetButton) return

    const card = targetButton.closest(".card")
    const id = card.dataset.productId
    const basket = getBasketLocalStorage();


    // проверка на наличия элемента в ЛС
    if(basket.includes(id)) return


    // Добавление элемента в ЛС
    basket.push(id)
    setBasketLocalStorage(basket)
    chekingActivateBasket(basket)

}

function chekingActivateBasket(basket){
    //Находим все кнопки 
    const buttons = document.querySelectorAll('.card_add')
    buttons.forEach(btn =>{
        const card = btn.closest('.card')
        const id = card.dataset.productId
        const isInBasket = basket.includes(id)

        

        btn.disabled = isInBasket
        btn.classList.toggle("active", isInBasket)
        btn.textContent = isInBasket ? "В корзине" : "В корзину"
    })
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