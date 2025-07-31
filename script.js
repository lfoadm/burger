const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const spanItem = document.getElementById('date-span');

let cart = [];

// Abre o modal do carrinho
cartBtn.addEventListener('click', function() {
    updateCartModal();
    cartModal.style.display = 'flex'
})

// Fecha o modal do carrinho
cartModal.addEventListener('click', function(event) {
    if (event.target === cartModal || event.target === closeModalBtn) {
        cartModal.style.display = 'none';
    }
})

// Adiciona o produto ao carrinho
menu.addEventListener('click', function(event) {
    // console.log(event.target);
    let parentButton = event.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price')) 
        addToCart(name, price);
    }
})

// Função para adicionar item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    
    if (existingItem) {
        existingItem.quantity += 1;
        
        Toastify({
        text: `+1 ${name} adicionado ao carrinho.`,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #E6C30E, #E6A90E)",
        },
        }).showToast();

        return;
    } else{
        cart.push({ name, price, quantity: 1 });
        
        Toastify({
        text: `${name} adicionado ao carrinho.`,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #E6C30E, #E6A90E)",
        },
        }).showToast();

    }
    updateCartModal()
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-3', 'flex-col');

        cartItemElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtde: ${item.quantity}</p>
                    <span class="font-bold">R$ ${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-from-cart-btn bg-gray-100  px-2 py-1 rounded" data-name="${item.name}">X</button>
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    });

    if (cart.length > 0) {
        cartCounter.classList.remove('hidden');
        cartCounter.textContent = cart.length;
    } else {
        cartCounter.classList.add('hidden');
    }    
}

// Evento para remover item do carrinho
cartItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const name = event.target.getAttribute('data-name');
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    
    if (index !== -1) {
        const item = cart[index];
        
        if (cart[index].quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

// // Evento para incluir o endereço
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500');
        addressWarn.classList.add('hidden');
    }
})

// Evento para finalizar o pedido
checkoutBtn.addEventListener('click', function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        
        Toastify({
        text: "O restaurante está fechado no momento!.",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #ef4444, #580f0f)",
        },
        }).showToast();


        return;
    }
    if(cart.length === 0) return;
    if(addressInput.value === '') {
        Toastify({
        text: "Informe seu endereço completo!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #ef4444, #j1j15)",
        },
        }).showToast();

        addressInput.classList.add('border-red-500');
        return;
    }

    // Enviar o pedido para o whatsapp
    const cartItems = cart
    .map(item => `• ${item.name} (R$ ${item.price.toFixed(2)}) x ${item.quantity}`)
    .join('\n');

    const total = parseFloat(
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)
    );

    const address = addressInput.value;

    const totalafter = total.toLocaleString("pt-BR", {
    style: 'currency',
    currency: 'BRL'
    });

    const message = encodeURIComponent(
    `\u{1F31F} Olá! Gostaria de fazer um pedido:\n\n${cartItems}\n\n\u{1F9FE} Total: ${totalafter}\n\u{1F4CD} Endereço: *${address}*\n\n\u{2705} _Aguardando confirmação!_`
    );

    const phone = '5534999749344'; // Substitua pelo número de telefone do restaurante
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');

    cart = []; // Limpa o carrinho após o pedido
    updateCartModal();

})


function checkRestaurantOpen() {
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

    // Horário de funcionamento: Segunda a Sexta, das 11h às 22h
    if (currentDay >= 0 && currentDay <= 6 && currentHour >= 11 && currentHour < 23,5) {
        return true;
    }
    return false;
}

const isOpen = checkRestaurantOpen();
if(isOpen){
    spanItem.classList.remove('bg-red-600');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-600');
}
