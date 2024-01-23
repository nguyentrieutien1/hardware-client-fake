import React from "react";
import Pagination from "react-bootstrap/Pagination";
interface PaginationProps {
  length: any;
  active: any;
  handleJump: any;
  step?: any;
}

export default function PaginationPage(props: PaginationProps) {
  const { length, active, handleJump, step = 8} = props;
  let items = [];
  for (let number = 1; number <= length / step + 1; number++) {
    items.push(
      <Pagination.Item
        defaultValue={active}
        onClick={() => handleJump(number)}
        activeLabel=""
        key={number}
        active={number === active}
      >
        {number}
      </Pagination.Item>
    );
  }
  return <Pagination size="sm">{items}</Pagination>;
}
