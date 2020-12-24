'use strict';
const JPEG_PREFIX = 'data:image/jpeg;base64';

const dataBase = JSON.parse(localStorage.getItem('avito')) || [];

const catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    btnAddAdv = document.querySelector('.add__adv'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalAdd = document.querySelector('.modal__add'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add'),
    searchInput = document.querySelector('.search__input'),
    searchReset = document.querySelector('.search__reset'),
    menuContainer = document.querySelector('.menu__container');


const modalHeaderItem = modalItem.querySelector('.modal__header-item'),
    modalStatusItem = modalItem.querySelector('.modal__status-item'),
    modalDescriptionItem = modalItem.querySelector('.modal__description-item'),
    modalCostItem = modalItem.querySelector('.modal__cost-item'),
    modalImageItem = modalItem.querySelector('.modal__image-item');

const textFileBtn = modalFileBtn.textContent;
const srcModalImageAdd = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const infoPhoto = {};

const saveDB = (data) => localStorage.setItem('avito', JSON.stringify(data));

const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    console.log('elementsModalSubmit: ', elementsModalSubmit[0].value);

    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
};

const closeModal = event => {
    const target = event.target;

    if (target.closest('.modal__close') ||
        target.classList.contains('modal') ||
        event.code === 'Escape') {
        modalItem.classList.add('hide');
        modalAdd.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImageAdd;
        modalFileBtn.textContent = textFileBtn;
        checkForm(); //reset the state of modalBtnSubmit && modalBtnWarning
    }
};

const renderCard = (data = dataBase) => {
    catalog.textContent = '';
    data.forEach(item => {
        catalog.insertAdjacentHTML('beforeend', `
            <li class="card" data-id="${item.id}">
                <img class="card__image" src="${JPEG_PREFIX}, ${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
        `);
    });

};

const getId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

//ADD EVENT LISTENER
menuContainer.addEventListener('click', event => {
    const target = event.target;

    if (target.tagName == 'A') {
        const result = dataBase.filter(item => {
            return item.category === target.dataset.category;
        });
        renderCard(result);
    }
});

searchReset.addEventListener('click', event => {
    searchInput.value = '';
    renderCard();
});

searchInput.addEventListener('input', event => {
    const value = searchInput.value.trim().toLowerCase();
    if (value.length > 2) {
        const result = dataBase.filter(item => {
            return item.nameItem.toLowerCase().includes(value) || item.descriptionItem.toLowerCase().includes(value);
        });
        renderCard(result);
    }
});

modalFileInput.addEventListener('change', event => {
    const target = event.target;

    const reader = new FileReader();

    const file = target.files[0];

    infoPhoto.fileName = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    reader.addEventListener('load', event => {
        if (infoPhoto.size < 400000) {
            modalFileBtn.textContent = infoPhoto.fileName;
            infoPhoto.base64 = btoa(event.target.result);
            modalImageAdd.src = `${JPEG_PREFIX}, ${infoPhoto.base64} `;
        } else {
            modalFileBtn.textContent = 'Файл не больше 200кБ';
            modalFileInput.value = '';
            checkForm();
        }
    });


});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    itemObj.image = infoPhoto.base64;
    itemObj.id = getId();
    dataBase.push(itemObj);
    closeModal({ target: modalAdd });
    saveDB(dataBase);
    renderCard();
});

//Open the modal to add a new card
btnAddAdv.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
});

//Open modal for a clicked card
catalog.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('.card');
    if (card) {
        const cardData = dataBase.filter(item => item.id === card.dataset.id)[0];
        console.log('card.dataset.id: ', card.dataset.id);
        console.log('cardData: ', cardData);
        modalHeaderItem.textContent = cardData.nameItem;
        modalStatusItem.textContent = (cardData.status == 'old') ? 'б/у' : 'новый';
        modalDescriptionItem.textContent = cardData.descriptionItem;
        modalCostItem.textContent = `${cardData.costItem} ₽`;
        modalImageItem.src = `${JPEG_PREFIX}, ${cardData.image} `;

        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

//FUNCTION CALLS
renderCard();