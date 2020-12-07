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
    modalImageAdd = document.querySelector('.modal__image-add');

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

const renderCard = () => {
    catalog.textContent = '';
    dataBase.forEach((item, index) => {
        // console.log('item: ', item);

        catalog.insertAdjacentHTML('beforeend', `
            <li class="card" data-id="${index}">
                <img class="card__image" src="${JPEG_PREFIX}, ${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
        `);
    });

};

//ADD EVENT LISTENER

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
            modalImageAdd.src = `${JPEG_PREFIX}, ${infoPhoto.base64}`;
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
    if (target.closest('.card')) {
        const cardData = dataBase[target.closest('.card').dataset.id];
        modalItem.querySelector('.modal__header-item').textContent = cardData.nameItem;
        modalItem.querySelector('.modal__status-item').textContent = (cardData.status == 'old') ? 'б/у' : 'новый';
        modalItem.querySelector('.modal__description-item').textContent = cardData.descriptionItem;
        modalItem.querySelector('.modal__cost-item').textContent = `${cardData.costItem} ₽`;
        modalItem.querySelector('.modal__image-item').src = `${JPEG_PREFIX}, ${cardData.image}`;
        console.dir(modalItem.querySelector('.modal__header-item'));
        console.log('cardData: ', cardData);



        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

//FUNCTION CALLS
renderCard();


