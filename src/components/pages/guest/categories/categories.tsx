import React, { useState } from "react";
import { useCategories } from "~/queries";
import Accordion from "react-bootstrap/Accordion";

interface CategoriesProps {
  setFilterByCategory?: any;
}
export default function Categories(props: CategoriesProps) {
  const { setFilterByCategory } = props;
  const [hideCategories, setHideCategories] = useState<boolean>(false);
  const { data: categories } = useCategories();
  return (
    <div className="col-lg-3 p-0">
      <div className="hero__categories">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className="hero__categories__all d-flex align-items-center justify-content-between">
                <div>
                  <i className="fa fa-bars" />
                  <span>Thể loại</span>
                </div>
                <span>{`(${
                  categories?.data ? categories?.data?.length : 0
                })`}</span>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <ul className="bg-white" style={{ zIndex: 3 }}>
                {categories?.data?.map((cat, i) => (
                  <li
                    className="cursor-pointer"
                    key={i}
                    onClick={() => setFilterByCategory(cat?.id)}
                  >
                    <a>{cat?.name}</a>
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
