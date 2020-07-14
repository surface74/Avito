'use strict';

const modalItem = document.querySelector('.modal__item'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  modalAdd = document.querySelector('.modal__add');

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
})

modalAdd.addEventListener('click', e => {
  const target = e.target;
  if (target.closest('.modal__close') ||
    target.classList.contains('modal__add')) {
    modalAdd.classList.add('hide');
    modalSubmit.reset();
  }
})

document.addEventListener('keydown', e => {
  if (e.keyCode == 27 && !modalAdd.classList.contains('.hide')) {
    modalAdd.classList.add('hide');
    modalSubmit.reset();
  }
})
