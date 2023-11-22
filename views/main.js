

const swiper = new Swiper('.swiper', {
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    slidesPerView: 2.8,
    simulateTouch: false,
});

var mediaQuery = window.matchMedia('(max-width: 535px)');

// Функция для обработки изменения медиа запроса
function handleMediaQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
    // Если медиа запрос соответствует условию, то меняем slidesPerView
    swiper.params.slidesPerView = 1;
    swiper.update();
    } else {
    // Если медиа запрос не соответствует условию, то возвращаем начальное значение slidesPerView
    swiper.params.slidesPerView = 3;
    swiper.update();
    }
}

// Modal hero-section

const buttonElem = document.querySelector('.hero__btn', '.btn__text');
const modalElem = document.querySelector('.modal');

modalElem.style.cssText = `
    z-index: 1000;
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms easy-in-out
`;

const closeModal = event => {
    const target = event.target;

    if (target === modalElem) {
        modalElem.style.visibility = 'hidden';
        modalElem.style.opacity = '0';

        setTimeout(() => {
            modalElem.style.visibility = 'hidden';
        }, 300)
    }
}

const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = '1';
};

buttonElem.addEventListener('click', openModal);
modalElem.addEventListener('click', closeModal);

//Modal cases-section
/*
const buttonsElem3 = document.querySelectorAll('.cases-slide__info_btn');
const modalElem3 = document.querySelector('.modal__cases');
const modalElem5 = document.querySelector('.modal__cases2'); // Находим модальное окно с классом 'modal__cases2'


modalElem3.style.cssText = `
    z-index: 1000;
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms ease-in-out
`;

modalElem5.style.cssText = `
    z-index: 1000;
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
`;

const closeModal3 = event => {
    const target = event.target;

    if (target === modalElem3) {
        modalElem3.style.visibility = 'hidden';
        modalElem3.style.opacity = '0';

        setTimeout(() => {
            modalElem3.style.visibility = 'hidden';
        }, 300)
    }
}

const openModal3 = () => {
    modalElem3.style.visibility = 'visible';
    modalElem3.style.opacity = '1';
};

buttonsElem3.forEach(button => {
    button.addEventListener('click', openModal3);
});

modalElem3.addEventListener('click', closeModal3);
// const bntTwoEL = document.querySelector(".btn2")
// bntTwoEL.addEventListener('click', openModal3)

*/
// Кнопки и модальные окна
const btn1 = document.getElementById('open-modal__btn1');
const btn2 = document.getElementById('open-modal__btn-2');
const btn3 = document.getElementById('open-modal__btn3');
const btn4 = document.getElementById('open-modal__btn4');
const btn5 = document.getElementById('open-modal__btn5');

const modal1 = document.querySelector('.modal__cases');
const modal2 = document.querySelector('.modal__cases2');
const modal3 = document.querySelector('.modal__cases3');
const modal4 = document.querySelector('.modal__cases4');
const modal5 = document.querySelector('.modal__cases5');

// Стили модальных окон
const setModalStyles = modal => {
    modal.style.cssText = `
        z-index: 1000;
        display: flex;
        visibility: hidden;
        opacity: 0;
        transition: opacity 300ms ease-in-out;
    `;
};

setModalStyles(modal1);
setModalStyles(modal2);
setModalStyles(modal3);
setModalStyles(modal4);
setModalStyles(modal5);

// Функции для открытия и закрытия модальных окон
const hideModal = (modal, event) => {
    if (event.target === modal) {
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';

        setTimeout(() => {
            modal.style.visibility = 'hidden';
        }, 300);
    }
};

const showModal = modal => {
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
};

// Добавление обработчиков событий для кнопок и модальных окон
btn1.addEventListener('click', () => showModal(modal1));
modal1.addEventListener('click', event => hideModal(modal1, event));

btn2.addEventListener('click', () => showModal(modal2));
modal2.addEventListener('click', event => hideModal(modal2, event));

btn3.addEventListener('click', () => showModal(modal3));
modal3.addEventListener('click', event => hideModal(modal3, event));

btn4.addEventListener('click', () => showModal(modal4));
modal4.addEventListener('click', event => hideModal(modal4, event));

btn5.addEventListener('click', () => showModal(modal5));
modal5.addEventListener('click', event => hideModal(modal5, event));



// Modal job-section

const buttonElem2 = document.querySelector('.btn__text');
const modalElem2 = document.querySelector('.modal');

modalElem2.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms easy-in-out
`;

const closeModal2 = event => {
    const target = event.target;

    if (target === modalElem) {
        modalElem2.style.visibility = 'hidden';
        modalElem2.style.opacity = '0';

        setTimeout(() => {
            modalElem2.style.visibility = 'hidden';
        }, 300)
    }
}

const openModal2 = () => {
    modalElem2.style.visibility = 'visible';
    modalElem2.style.opacity = '1';
};

buttonElem2.addEventListener('click', openModal);
modalElem2.addEventListener('click', closeModal);

// Rates section

const buttonsElem4 = document.querySelectorAll('.rates-block__rate');
const modalElem4 = document.querySelector('.modal__rates');

modalElem4.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms easy-in-out
`;

const closeModal4 = event => {
    const target = event.target;

    if (target === modalElem4) {
        modalElem4.style.visibility = 'hidden';
        modalElem4.style.opacity = '0';

        setTimeout(() => {
            modalElem4.style.visibility = 'hidden';
        }, 300)
    }
}

const openModal4 = () => {
    modalElem4.style.visibility = 'visible';
    modalElem4.style.opacity = '1';
};

buttonsElem4.forEach(buttonElem4 => {
    buttonElem4.addEventListener('click', openModal4);
});

modalElem4.addEventListener('click', closeModal4);


// asking

const askings = document.querySelectorAll('.asking');
    
    askings.forEach((asking) => {
        const arrow = asking.querySelector('.arrow_down');
        const answer = asking.querySelector('.answer');
        
        asking.addEventListener('click', () => {
            if (answer.style.display === 'none' || answer.style.display === '') {
                answer.style.display = 'block';
                arrow.classList.add('expanded');
            } else {
                answer.style.display = 'none';
                arrow.classList.remove('expanded');
        }
    });
});

const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
    anchor.addEventListener("click", function(event) {
        event.preventDefault();
        const blockID = anchor.getAttribute('href')
        document.querySelector('' + blockID).scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    })
}



const burger = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');
const body = document.body

if (burger && menu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('_active');
        menu.classList.toggle('_active');
        body.classList.toggle('_lock');
    })
}