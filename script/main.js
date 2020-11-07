'use strict';

const catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item'),
  btnAddAdv = document.querySelector('.add__adv'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  modalAdd = document.querySelector('.modal__add');

//Open modal for a clicked card
catalog.addEventListener('click', e => {
  const target = e.target;
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
  }
});

//Open modal to add a new card
btnAddAdv.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
});

//Close modal for item of catalog
modalItem.addEventListener('click', e => {
  const target = e.target;
  if (target.closest('.modal__close') ||
    target === modalItem) {
    modalItem.classList.add('hide');
  }
});

//Close modal for a new card
modalAdd.addEventListener('click', e => {
  const target = e.target;
  if (target.closest('.modal__close') ||
    target === modalAdd) {
    modalAdd.classList.add('hide');
    modalSubmit.reset();
  }
});

//Close modals by pressing 'Esc'
document.addEventListener('keydown', e => {
  console.log(e);
  if (e.keyCode == 27) {
    if (!modalAdd.classList.contains('.hide')) {
      modalAdd.classList.add('hide');
      modalSubmit.reset();
    }
    if (!modalItem.classList.contains('.hide')) {
      modalItem.classList.add('hide');
    }
  }
});
