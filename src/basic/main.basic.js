import './utils/alertEvent';
import { PRODUCT_LIST } from '../constant';
import {
  Title,
  Select,
  NewItem,
  Wrapper,
  AddButton,
  TotalPrice,
  StockStatus,
  CartDisplay,
} from './components';
import { updateSelectOption, updateCartSummary } from './utils';

function main() {
  const root = document.getElementById('app');
  const wrapper = Wrapper();

  wrapper.appendChild(Title());
  wrapper.appendChild(CartDisplay());
  wrapper.appendChild(TotalPrice());
  wrapper.appendChild(Select());
  wrapper.appendChild(AddButton());
  wrapper.appendChild(StockStatus());
  root.appendChild(wrapper);
  updateSelectOption();
  updateCartSummary();
}

main();

document.getElementById('add-to-cart').addEventListener('click', () => {
  const selectItem = document.getElementById('product-select').value;
  const itemToAdd = PRODUCT_LIST.find((product) => {
    return product.id === selectItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      document.getElementById('cart-items').innerHTML += NewItem(itemToAdd);
      itemToAdd.quantity--;
    }
    updateCartSummary();
  }
});

document
  .getElementById('cart-items')
  .addEventListener('click', function (event) {
    const tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = PRODUCT_LIST.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const newQty =
          parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
            prod.quantity +
              parseInt(
                itemElem.querySelector('span').textContent.split('x ')[1]
              )
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            newQty;
          prod.quantity -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        itemElem.remove();
      }
      updateCartSummary();
    }
  });
