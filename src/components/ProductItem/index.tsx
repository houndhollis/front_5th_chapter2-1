import { ProductInfo } from '../../type';

interface Props {
  props: ProductInfo;
}

export const ProductItem = ({ props }: Props) => {
  return (
    <span>
      {props.name} - {props.price}원 x {props.quantity}
    </span>
  );
};
