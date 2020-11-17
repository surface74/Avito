'use strict';

const dataBase = [];

const catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item'),
  btnAddAdv = document.querySelector('.add__adv'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  modalAdd = document.querySelector('.modal__add'),
  modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements]
  .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const checkForm = () => {
  const validForm = elementsModalSubmit.every(elem => elem.value);
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
    checkForm(); //reset the state of modalBtnSubmit && modalBtnWarning
  }
};

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
  event.preventDefault();
  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  dataBase.push(itemObj);
  closeModal({ target: modalAdd });
});

//Open the modal to add a new card
btnAddAdv.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.addEventListener('keydown', closeModal);
});

//Open modal for a clicked card
catalog.addEventListener('click', e => {
  const target = e.target;
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
    document.addEventListener('keydown', closeModal);
  }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);



