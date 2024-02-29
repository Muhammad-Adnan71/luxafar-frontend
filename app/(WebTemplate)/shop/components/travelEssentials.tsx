"use client";
import MainHeading from "@template-components/heading";
import SideHeading from "@template-components/side-heading";
import Container from "components/template/container";
import React from "react";
import ProductCardWrapper from "./productCardWrapper";
import ShopTabs from "./shopTabs";
import product1 from "@public/template/shop/product1.png";
import product2 from "@public/template/shop/product2.png";
import product3 from "@public/template/shop/product3.png";

const TravelEssentials = () => {
  const productData = [
    {
      title: "Lorem ipsum product",
      price: "200",
      image: product1,
      productRating: 4.5,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      title: "Lorem ipsum product",
      price: "200",
      image: product2,
      productRating: 4.5,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      title: "Lorem ipsum product",
      price: "200",
      image: product3,
      productRating: 4.5,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      title: "Lorem ipsum product",
      price: "200",
      image: product1,
      productRating: 4.5,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];
  const tabsItems = [
    {
      label: "Lorem",
      onClick: (value: any) => {},
      content: (
        <>
          <div>hello1</div>
        </>
      ),
    },
    {
      label: "Lorem2",
      onClick: (value: any) => {},
      content: (
        <>
          <div>hello2</div>
        </>
      ),
    },
    {
      label: "Lorem3",
      onClick: (value: any) => {},
      content: (
        <>
          <div>hello3</div>
        </>
      ),
    },
    {
      label: "Lorem4",
      onClick: (value: any) => {},
      content: (
        <>
          <div>hello4</div>
        </>
      ),
    },
  ];
  return (
    <Container>
      <SideHeading classes="absolute " isRotate={false}>
        Products
      </SideHeading>
      <div className="flex my-8 gap-x-10 max-md:gap-y-8 max-md:flex-col justify-between">
        <div className="w-1/2 max-md:w-full">
          <MainHeading classes="md:text-[38px] lg:text-[46px] xl:text-[60px]">
            Travel <br className="md:hidden" />{" "}
            <strong className="text-secondary-color">Essentials</strong>
          </MainHeading>
        </div>
        <div className="w-1/2 max-md:w-full md:flex md:py-8 md:items-center px-12 max-md:px-0 max-lg:px-8 justify-between md:bg-quaternary-color">
          <ShopTabs tabsItem={tabsItems} defaultValue="Lorem" />
        </div>
      </div>

      <ProductCardWrapper
        isBestSeller={false}
        isHorizontalView={false}
        productData={productData}
      />
    </Container>
  );
};

export default TravelEssentials;
