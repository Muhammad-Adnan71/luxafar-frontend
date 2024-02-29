"use client";
import Breadcrumbs from "@template-components/breadcrumbs";
import Container from "components/template/container";
import Image from "next/image";
import React from "react";
import detailSlider from "@public/template/shop/detailSlider.png";
import Subheading from "@template-components/sub-heading";
import Rating from "components/CMS/components-ui/rating";
import Paragraph from "@template-components/paragraph";
import NameHeading from "@template-components/nameHeading";
import Button from "@template-components/button";
import Counter from "../../components/counter";
import MainHeading from "@template-components/heading";
import ProductCardWrapper from "../../components/productCardWrapper";
import product1 from "@public/template/shop/product1.png";
import product2 from "@public/template/shop/product2.png";
import product3 from "@public/template/shop/product3.png";
import detailSliderMobile from "@public/template/shop/detailSliderMobile.png";
import { WEB_ROUTES } from "lib/utils";

const ProductDetail = () => {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "Shop", url: WEB_ROUTES.SHOP },
    { name: "product", url: "as" },
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
    <Container>
      <Breadcrumbs
        classes="mb-8 max-lg:hidden"
        itemClasses="xl:text-[10px]"
        breadcrumbs={breadCrumbs}
      />
      <div className="flex lg:gap-x-16 max-lg:gap-y-10 max-lg:flex-col mb-20 max-md:mb-12">
        <div className="w-[65%] max-lg:w-full">
          <Image
            className="max-sm:hidden w-full h-full"
            src={detailSlider}
            alt=""
          />
          <Image
            className="sm:hidden w-full h-full max-h-[550px]"
            src={detailSliderMobile}
            alt=""
          />
        </div>
        <div className="w-[35%] max-lg:w-full">
          <Subheading classes="sm:text-[48px] max-sm:text-[36px] font-[600] mb-6">
            Lorem Ipsum Product
          </Subheading>
          <Rating
            size={20}
            rating={4.5}
            handleRating={() => console.log("hello")}
          />
          <Paragraph classes="md:text-[36px] max-md:text-[26px] py-6 max-sm:py-4 font-[600]">
            $200.00
          </Paragraph>
          <NameHeading className="text-[14px] font-[600] mb-4">
            Overview
          </NameHeading>
          <Paragraph classes="mb-6 max-sm:text-[12px]">
            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
            impedit quo minus id quod maxime placeat facere possimus.
          </Paragraph>
          <Counter />
          <Button
            classes="mt-6"
            text="add to cart"
            redirect="/shop/product/cart"
          />
        </div>
      </div>
      <div className="mb-20 max-md:mb-12">
        <MainHeading classes="lg:text-[55px] mb-10">
          Detail{" "}
          <strong className="text-secondary-color inline-block">
            Description
          </strong>
        </MainHeading>
        <Paragraph>
          Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
          impedit quo minus id quod maxime placeat facere possimus, omnis amet
          voluptas assumenda est, omnis dolor repellendus quis nostrum. <br />
          <br />
          Temporibus autem quibusdam et aut officiis debitis aut rerum dolorem
          necessitatibus saepe eveniet ut et neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, ut aliquid ex ea
          commodi consequatur.
        </Paragraph>
      </div>
      <div className="mb-16">
        <MainHeading classes="lg:text-[55px] mb-10">
          Related{" "}
          <strong className="text-secondary-color inline-block">
            Products
          </strong>
        </MainHeading>
        <ProductCardWrapper
          productData={productData}
          isHorizontalView={true}
          isBestSeller={true}
        />
      </div>
    </Container>
  );
};

export default ProductDetail;
