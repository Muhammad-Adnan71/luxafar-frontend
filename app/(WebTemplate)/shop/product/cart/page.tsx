"use client";
import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import Container from "components/template/container";

import React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import cartProduct from "@public/template/shop/cartProduct.png";
import Image from "next/image";
import Paragraph from "@template-components/paragraph";
import Input from "@template-components/input";
import Button from "@template-components/button";
import Counter from "../../components/counter";
import { WEB_ROUTES } from "lib/utils";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const Cart = () => {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "Shop", url: WEB_ROUTES.SHOP },
    { name: "product", url: "as" },
    { name: "cart", url: "cart" },
  ];
  const cartTableData = [
    {
      title: "Lorem Ipsum product",
      image: cartProduct,
      price: 200,
      quantity: 1,
      total: 200,
    },
    {
      title: "Lorem Ipsum product",
      image: cartProduct,
      price: 200,
      quantity: 1,
      total: 200,
    },
    {
      title: "Lorem Ipsum product",
      image: cartProduct,
      price: 200,
      quantity: 1,
      total: 200,
    },
  ];

  const methods = useForm<any>({
    // resolver: zodResolver(BecomePartnerSchema),
    mode: "onBlur",
  });
  return (
    <Container>
      <Breadcrumbs
        classes="mb-9 max-lg:hidden  pt-6 -ml-[11px]"
        itemClasses="text-[10px]"
        breadcrumbs={breadCrumbs}
      />
      <MainHeading classes="text-secondary-color font-[600] max-sm:text-[40px] max-lg:mt-6 lg:text-[55px] mb-10">
        Cart
      </MainHeading>
      <table className="w-full mb-24 max-sm:hidden">
        <thead>
          <tr className="bg-quaternary-color ">
            <th className="w-[6%]"></th>
            <th className="w-[17%] text-secondary-color uppercase text-[13px] max-lg:text-[11px] font-[600] py-5">
              Image
            </th>
            <th className="w-[21%] text-secondary-color text-left uppercase text-[13px] max-lg:text-[11px] font-[600] py-5">
              Product
            </th>
            <th className="w-[15%] text-secondary-color uppercase text-[13px] max-lg:text-[11px] font-[600] py-5">
              Price
            </th>
            <th className="w-[8%] text-secondary-color uppercase text-[13px] max-lg:text-[11px] font-[600] py-5">
              qty
            </th>
            <th className="w-1/5 text-secondary-color uppercase text-[13px] max-lg:text-[11px] font-[600] py-5">
              total
            </th>
          </tr>
        </thead>
        <tbody>
          {cartTableData.map((data: any, index: number) => {
            return (
              <tr
                key={index}
                className="bg-[#000000] text-center bg-opacity-[.37] bg-blend-multiply border-b border-quaternary-color last:border-none"
              >
                <td className="py-6 text-center border-r  border-quaternary-color">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-secondary-color w-[30px] max-lg:w-[20px] max-lg:h-[20px] mx-auto h-[30px] cursor-pointer"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </td>
                <td className="py-6  border-quaternary-color">
                  <span className="bg-shop-banner-color ">
                    <Image
                      className="w-full h-full max-lg:max-w-[80px] max-md:max-w-[70px] max-w-[110px] mx-auto"
                      src={data.image}
                      alt=""
                    />
                  </span>
                </td>
                <td className="font-body py-6 border-r  border-quaternary-color text-secondary-color text-left text-[15px] max-lg:text-[13px] font-[400]">
                  <span className="w-[55%] max-lg:w-3/4  block leading-[1.5]">
                    {data.title}
                  </span>
                </td>
                <td className="text-[16px] max-lg:text-[14px] border-r  border-quaternary-color py-6  text-white font-[600]">
                  ${data.price}.00
                </td>
                <td className="py-6 border-r  border-quaternary-color">
                  <span className="text-primary-color bg-secondary-color font-body font-[500] py-[0.6rem] max-lg:py-[0.3rem] max-lg:px-[0.6rem] px-4  text-[14px]">
                    {data.quantity}
                  </span>
                </td>
                <td className="text-[16px] max-lg:text-[14px]  py-6 border-r border-quaternary-color text-white font-[600]">
                  ${data.total}.00
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="sm:hidden mb-10">
        {cartTableData.map((data: any, index: number) => {
          return (
            <div
              className="bg-[#000000] mb-3 bg-opacity-[0.37] p-5 max-[410px]:p-3 w-full"
              key={index}
            >
              <div className="flex gap-x-3 justify-between">
                <div className="w-[31%] max-[410px]:w-[29%]">
                  <Image className="w-full h-full" src={data.image} alt="" />
                </div>
                <div className="w-[34%] max-[410px]:w-[42%] flex flex-col justify-between">
                  <span className="font-body text-[16px] font-[500] max-[450px]:text-[13px] text-secondary-color">
                    {data.title}
                  </span>
                  <Counter isInnerPage={true} />
                </div>
                <div className="w-[28%] max-[410px]:w-[29%] text-right flex flex-col justify-between">
                  <div className="w-full text-right">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-secondary-color w-[20px] ml-auto h-[20px] cursor-pointer"
                    >
                      <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div className="w-full">
                    <span className="text-[14px] font-body font-[600] text-white">
                      ${data.price}.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h3 className="relative font-heading font-[600] max-sm:text-[24px] text-[36px] after:w-[calc(100%-170px)] after:h-[1px] after:top-[50%] after:translate-y-[2px] after:right-0 after:absolute after:bg-secondary-color after:ml-auto max-md:after:content-none text-secondary-color">
          Coupon
        </h3>
        <div className="-mt-[15px] max-md:gap-y-12 mb-28 max-sm:mb-20 max-md:flex-col flex gap-x-20 max-lg:gap-x-16 justify-between">
          <div className="w-1/2 max-md:w-full max-md:pt-5 md:pt-14">
            <Paragraph classes="max-md:hidden">
              Enter your coupon code if you have one.
            </Paragraph>
            <FormProvider {...methods}>
              <form onSubmit={() => {}}>
                <Input
                  name="coupon"
                  classes="my-10 py-4 max-sm:my-6 max-md:placeholder:text-center max-md:placeholder:text-[11px]"
                  placeholder="Voucher Code"
                />
              </form>
              <Button classes="px-10 max-md:px-6 " text="apply" />
            </FormProvider>
          </div>
          <div className="w-[45%] max-sm:p-7 max-md:w-full max-lg:w-1/2 p-16 max-lg:p-8 bg-quaternary-color">
            <div className="w-full flex justify-between border-b border-secondary-color">
              <Paragraph classes="capitalize text-[13px] max-sm:text-[11px] max-sm:mb-2 opacity-100 font-[500]">
                Subtotal
              </Paragraph>
              <Paragraph classes="capitalize text-[13px] max-sm:text-[11px] max-sm:mb-2 opacity-100 font-[500]">
                $400.00
              </Paragraph>
            </div>
            <div className="w-full pt-5 max-sm:pt-2 flex justify-between border-b border-secondary-color">
              <Paragraph classes="capitalize text-[13px] max-sm:text-[11px] max-sm:mb-2 opacity-100 font-[500]">
                Shipping
              </Paragraph>
              <Paragraph classes="capitalize text-[13px] max-sm:text-[11px] max-sm:mb-2 opacity-100 font-[500]">
                $20.00
              </Paragraph>
            </div>
            <div className="w-full pt-5 max-sm:pt-2 flex justify-between mb-8 max-sm:mb-5">
              <Paragraph classes="uppercase text-secondary-color text-[13px] max-sm:text-[12px] max-sm:mb-2 opacity-100 font-[500]">
                Total
              </Paragraph>
              <Paragraph classes="uppercase text-secondary-color text-[13px] max-sm:text-[12px] max-sm:mb-2 opacity-100 font-[500]">
                $420.00
              </Paragraph>
            </div>
            <Button
              redirect="/shop/product/cart/checkout"
              classes="w-full text-center py-4 max-sm:py-3"
              text="checkout"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
