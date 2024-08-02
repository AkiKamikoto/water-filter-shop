const wrapper = document.querySelector('.wrapper');
let productsData = []
getProducts()

async function getProducts(){
    try{
        if(!productsData.length){
            const res = await fetch("../data/products.json")
            productsData = await res.json();
        }

        loadProductDetails(productsData)
    } catch{

    }

}


// Берем параметр из ссылки
function getParametrFromUrl(parametr){
    //поиск в названии ссылки
    const urlParams = new URLSearchParams(window.location.search);
    //метод get позволяет получить иммено значание того что ищем
    return urlParams.get(parametr)
}

function loadProductDetails(data){


    const productId = Number(getParametrFromUrl('id'))
    if(!productId){
        console.log("error")
        return
    }



    const findProduct = data.find(card => card.id === productId );
    console.log(findProduct)

    renderInfoProduct(findProduct)
}








function renderInfoProduct(product) {
    console.log("render")
    const {id, img, title, price, install, type,func, waterPipes,purificationStages,FilterModuleIncluded,Equipment } = product;
    const productItem = 
        `
        
        <div class="container-fluid">
            <div class="main-page">
                <div class="main_info" data-product-id=${id}>
                                <div class="img_info">
                                    <img class="item_img" src="./images/item/${img}" alt="${title}">
                                </div>
                            <div class="price_info">
                                <h1 class="product_title">${title}</h1>
                                <hr class="line">
                                <b>Цена:</b>${price}₸
                                <div class="main_description">\
                                    <ul>
                                        <li>
                                            Тип фильтра/способ размещения: ${install}
                                        </li>
                                        <li>
                                            Тип устройства: ${type}
                                        </li>
                                        <li>
                                            Подключение к водопроводу: ${waterPipes ? "Да" : "Нет"}
                                        </li>
                                        <li>
                                            Фильтрующий модуль в комплекте: ${FilterModuleIncluded ? "Да" : "Нет"}
                                        </li>
                                    </ul>
                                </div>
                                <button type="button" class="btn btn-primary card_add">В корзину</button>
                            </div>
                            
                </div>
            </div>
        </div>

        <div class="container-fluid">
        <div class="description">
          <h2>Характеристики ${title}</h2>
          <div class="row g-2">
            <div class="col-6">
              <div class="p-3">Тип фильтра/способ размещения</div>
            </div>
            <div class="col-6">
              <div class="p-3">${install}</div>
            </div>
          </div>
    
          <div class="row g-2">
            <div class="col-6">
              <div class="p-3">Тип устройства</div>
            </div>
            <div class="col-6">
              <div class="p-3">${type}</div>
            </div>
          </div>

          <div class="row g-2">
            <div class="col-6">
              <div class="p-3">Функции</div>
            </div>
            <div class="col-6">
              <div class="p-3">${func}</div>
            </div>
          </div>

          <div class="row g-2">
          <div class="col-6">
            <div class="p-3">Подключение к водопроводу</div>
          </div>
          <div class="col-6">
            <div class="p-3">${waterPipes ? "Да" : "Нет"}</div>
          </div>
        </div>

        <div class="row g-2">
        <div class="col-6">
          <div class="p-3">Число ступеней очистки</div>
        </div>
        <div class="col-6">
          <div class="p-3">${purificationStages}</div>
        </div>
      </div>

      <div class="row g-2">
        <div class="col-6">
          <div class="p-3">Фильтрующий модуль в комплекте</div>
        </div>
        <div class="col-6">
          <div class="p-3">${FilterModuleIncluded ? "Да" : "Нет"}</div>
        </div>
      </div>

      <div class="row g-2">
      <div class="col-6">
        <div class="p-3">Комплектация</div>
      </div>
      <div class="col-6">
        <div class="p-3">${Equipment}</div>
      </div>
    </div>



        </div>
      </div>
        `
    wrapper.insertAdjacentHTML('beforeend', productItem);
}

wrapper.onclick = function(event){
    
    const targetButton = event.target.closest(".card_add")
    if(!targetButton) return

    const card = targetButton.closest(".main_info")
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
    const btn = document.querySelector('.card_add')

        const card = btn.closest('.main_info')
        const id = card.dataset.productId
        const isInBasket = basket.includes(id)

        

        btn.disabled = isInBasket
        btn.classList.toggle("active", isInBasket)
        btn.textContent = isInBasket ? "В корзине" : "В корзину"
    
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