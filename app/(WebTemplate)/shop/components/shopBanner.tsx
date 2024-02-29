import Breadcrumbs from "@template-components/breadcrumbs";
import Button from "@template-components/button";
import MainHeading from "@template-components/heading";
import NameHeading from "@template-components/nameHeading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import featuredProduct from "@public/template/shop/featuredProduct.png";
import featuredProductMobile from "@public/template/shop/featuredProductMobile.png";

import Image from "next/image";
import React from "react";
import { WEB_ROUTES } from "lib/utils";

const ShopBanner = () => {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "Shop", url: WEB_ROUTES.SHOP },
  ];

  return (
    <div>
      <div className="relative max-lg:static pb-8 w-full lg:bg-shop-banner-color lg:h-[calc(100vh_-_158px)]">
        <div className="relative max-lg:flex max-lg:flex-col w-full">
          <Container classes="lg:absolute max-lg:order-2 max-lg:static pb-8 lg:top-0 lg:left-1/2 lg:-translate-x-1/2 ">
            <div className="lg:w-2/5 ">
              <Breadcrumbs
                breadcrumbs={breadCrumbs}
                classes="mb-8 max-lg:hidden  pt-6 -ml-[11px]"
                itemClasses="text-[10px]"
              />
              <NameHeading className="inline-block max-sm:mb-0 text-primary-color text-[10px] font-[600] uppercase py-[5px] px-2 bg-secondary-color">
                Best Seller
              </NameHeading>
              <MainHeading classes="xl:text-[45px] lg:text-[42px] max-sm:text-[36px] max-[380px]:text-[24px] text-secondary-color font-[600] py-6 max-sm:py-5 w-fit">
                Making Your <br className="max-lg:hidden" /> Sleep{" "}
                <br className="lg:hidden" /> More{" "}
                <br className="max-lg:hidden" /> Relaxing!
              </MainHeading>
              <Paragraph classes="mb-10 max-sm:mb-4 max-sm:text-[12px] max-sm:line-clamp-7 lg:line-clamp-5 ">
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without relying on meaningful content. Lorem ipsum
                may be used as a placeholder before final copy is available.
              </Paragraph>
              <Button
                classes="px-8 py-[10px]"
                text="Shop now"
                redirect="/shop/product/1"
              />
            </div>
          </Container>
          <Image
            className="w-[85%] max-lg:order-1 max-lg:mx-auto max-lg:mb-8 max-lg:w-4/5 object-right  block ml-auto !h-[calc(100vh_-_158px) max-lg:!h-[calc(100vh_-_280px)] max-sm:hidden object-cover  "
            style={{ height: "calc(100vh - 158px)" }}
            alt=""
            src={featuredProduct}
          />
          <div className="sm:hidden mb-8 overflow-hidden w-4/5 mx-auto bg-shop-banner-color">
            <Image
              className="sm:hidden w-full max-h-[390px] object-cover"
              src={featuredProductMobile}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
