"use client";
import React from "react";
import ShopBanner from "./components/shopBanner";
import ServiceCard from "./components/serviceCard";
import TravelEssentials from "./components/travelEssentials";
import deliveryTruck from "@public/template/shop/deliveryTruck.png";
import money from "@public/template/shop/money.png";
import person from "@public/template/shop/person.png";
import MainHeading from "@template-components/heading";
import ProductCardWrapper from "./components/productCardWrapper";
import product1 from "@public/template/shop/product1.png";
import product2 from "@public/template/shop/product2.png";
import product3 from "@public/template/shop/product3.png";
import Container from "components/template/container";

const Shop = () => {
  const serviceData = [
    {
      title: "Free shipping worldwide",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      image: deliveryTruck,
    },
    {
      title: "Money back Guarantee",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      image: money,
    },
    {
      title: "24/7 help center",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      image: person,
    },
  ];
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
  return (
    <div>
      <ShopBanner />
      <ServiceCard serviceData={serviceData.slice(0, 3)} />
      <TravelEssentials />
      <Container>
        <div className="my-3">
          <MainHeading classes="xl:text-[60px]">
            <strong className="text-secondary-color">coming </strong> Soon
          </MainHeading>
          <div className="mt-10">
            <ProductCardWrapper
              isBestSeller={false}
              isHorizontalView={true}
              productData={productData}
            />
          </div>
        </div>
        <div className="my-3 mb-16">
          <MainHeading classes="xl:text-[60px]">
            <strong className="text-secondary-color">best </strong> seller
          </MainHeading>
          <div className="mt-8">
            <ProductCardWrapper
              isBestSeller={true}
              isHorizontalView={true}
              productData={productData}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
