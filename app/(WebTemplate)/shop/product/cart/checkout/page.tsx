"use client";
import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import Input from "@template-components/input";
import NameHeading from "@template-components/nameHeading";
import SearchSelectInput from "@template-components/searchSelect";
import Container from "components/template/container";

import {
  RadioGroup,
  RadioGroupItem,
} from "components/CMS/components-ui/shadcn/ui/radio-group";
import checkoutCart from "@public/template/shop/checkoutProduct.png";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import React from "react";
import Button from "@template-components/button";
import Image from "next/image";
import Paragraph from "@template-components/paragraph";
import { WEB_ROUTES } from "lib/utils";
import { FormProvider, useForm } from "react-hook-form";

const Checkout = () => {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "Shop", url: WEB_ROUTES.SHOP },
    { name: "product", url: "as" },
    { name: "cart", url: "cart" },
    { name: "checkout", url: "checkout" },
  ];
  const items = [
    {
      label: "country 1",
      value: "country 1",
    },
  ];
  const methods = useForm<any>({
    // resolver: zodResolver(BecomePartnerSchema),
    mode: "onBlur",
  });
  return (
    <Container>
      <FormProvider {...methods}>
        <form onSubmit={() => {}}>
          <div className="mb-40">
            <Breadcrumbs
              classes="mb-9 max-lg:hidden  pt-6 -ml-[11px]"
              itemClasses="text-[10px]"
              breadcrumbs={breadCrumbs}
            />
            <MainHeading classes="text-secondary-color font-[600] max-sm:text-[40px] max-lg:mt-6 lg:text-[55px] mb-10">
              Checkout
            </MainHeading>

            <div className="flex max-lg:flex-col max-lg:gap-y-10 max-sm:gap-y-6 lg:gap-x-5x xl:gap-x-20 justify-between">
              <div className="lg:w-[52%] max-lg:w-full">
                <NameHeading className="mb-8 max-lg:hidden font-[500]">
                  Billing Details
                </NameHeading>
                <div className="flex gap-x-6 mb-4 max-sm:mb-2 max-sm:flex-col max-sm:gap-y-2">
                  <div className="w-1/2 max-sm:w-full">
                    <Input
                      name="firstName"
                      classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                      isInnerPage={true}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="w-1/2 max-sm:w-full">
                    <Input
                      name="lastName"
                      classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                      isInnerPage={true}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="w-full mb-4 max-sm:mb-2">
                  <Input
                    name="shippingAddress"
                    classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                    isInnerPage={true}
                    placeholder="Shipping Address"
                  />
                </div>
                <div className="w-full mb-4 max-sm:mb-2">
                  <Input
                    name="address"
                    classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                    isInnerPage={true}
                    placeholder="Shipping Address"
                  />
                </div>
                <div className="flex max-sm:flex-col max-sm:gap-y-2 gap-x-6 mb-4 max-sm:mb-2">
                  <div className="w-1/2 max-sm:w-full">
                    <SearchSelectInput
                      isBorderBold={true}
                      placeHolder="Country"
                      items={items}
                    />
                  </div>
                  <div className="w-1/2 max-sm:w-full">
                    <SearchSelectInput
                      isBorderBold={true}
                      placeHolder="Province"
                      items={items}
                    />
                  </div>
                </div>
                <div className="w-full mb-4 max-sm:mb-2">
                  <Input
                    name="postCode"
                    classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                    isInnerPage={true}
                    placeholder="Post Code/ZIP"
                  />
                </div>
                <div className="w-full mb-4 max-sm:mb-2">
                  <Input
                    name="shop"
                    classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                    isInnerPage={true}
                    placeholder="Shop"
                  />
                </div>
                <div className="w-full mb-4 max-sm:mb-2">
                  <Input
                    name="email"
                    classes="py-4 max-sm:py-3 max-sm:bg-primary-color bg-[transparent]"
                    isInnerPage={true}
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <RadioGroup className="flex gap-7 my-6 max-sm:mb-8">
                    <div className="flex items-center space-x-3 ">
                      <RadioGroupItem
                        isSingleItem={true}
                        value="yes"
                        id="r2"
                        className="border-secondary-color w-[20px] h-[20px] border-[2px]"
                      />
                      <Label
                        htmlFor="r2"
                        className="text-[14px] opacity-80 max-sm:text-[12px] font-light"
                      >
                        Save this information
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="lg:hidden mb-10">
                  <div className="flex mb-2 pb-2 border-b border-secondary-color justify-between">
                    <Paragraph classes="mb-0 opacity-100 max-sm:text-[12px]">
                      Subtotal
                    </Paragraph>
                    <Paragraph classes="mb-0 opacity-100 max-sm:text-[12px]">
                      $400.00
                    </Paragraph>
                  </div>
                  <div className="flex lg:mb-6 max-lg:mb-2 pb-2 border-b border-secondary-color justify-between">
                    <Paragraph classes="mb-0 opacity-100 max-sm:text-[12px]">
                      Shipping
                    </Paragraph>
                    <Paragraph classes="mb-0 opacity-100 max-sm:text-[12px]">
                      $400.00
                    </Paragraph>
                  </div>
                  <div className="flex justify-between">
                    <Paragraph classes="mb-0 text-secondary-color max-sm:text-[12px] font-[500] uppercase opacity-100">
                      Total
                    </Paragraph>
                    <Paragraph classes="mb-0 text-secondary-color max-sm:text-[12px] font-[500] opacity-100">
                      $400.00
                    </Paragraph>
                  </div>
                </div>
                <div className="max-[500px]:flex max-[500px]:flex-col  flex">
                  <Button
                    classes="max-[500px]:w-full max-[500px]:text-center max-[500px]:mb-3 text-secondary-color bg-[transparent] mr-8 border border-secondary-color"
                    text="Back to shop"
                  />
                  <Button
                    classes="px-8 max-[500px]:w-full max-[500px]:text-center "
                    text="payment"
                  />
                </div>
              </div>
              <div className="xl:w-[35%] max-lg:-order-1 lg:w-2/5">
                <NameHeading className="mb-8 font-[500] max-sm:text-[12px] ">
                  Your Order
                </NameHeading>
                <div className="flex gap-x-6 mb-5">
                  <div className="w-[120px] max-sm:w-[110px]">
                    <Image
                      className="w-full h-full object-cover"
                      src={checkoutCart}
                      alt=""
                    />
                  </div>
                  <div className="w-3/5 flex flex-col justify-between">
                    <div>
                      <Paragraph classes="mb-0 max-sm:text-[11px] text-secondary-color opacity-100 font-[500]">
                        Sample Product Image
                      </Paragraph>
                      <Paragraph classes="mb-0 max-sm:text-[11px]">
                        Color: Red
                      </Paragraph>
                      <Paragraph classes="mb-0 max-sm:text-[11px]">
                        Size: L
                      </Paragraph>
                    </div>
                    <div>
                      <Paragraph classes="sm:text-[16px]  mb-0 font-[500] opacity-100 text-secondary-color">
                        $200.00
                      </Paragraph>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-6 mb-5">
                  <div className="w-[120px] max-sm:w-[110px]">
                    <Image
                      className="w-full h-full object-cover"
                      src={checkoutCart}
                      alt=""
                    />
                  </div>
                  <div className="w-3/5 flex flex-col justify-between">
                    <div>
                      <Paragraph classes="mb-0 max-sm:text-[11px] text-secondary-color opacity-100 font-[500]">
                        Sample Product Image
                      </Paragraph>
                      <Paragraph classes="mb-0 max-sm:text-[11px]">
                        Color: Red
                      </Paragraph>
                      <Paragraph classes="mb-0 max-sm:text-[11px]">
                        Size: L
                      </Paragraph>
                    </div>
                    <div>
                      <Paragraph classes="sm:text-[16px]  mb-0 font-[500] opacity-100 text-secondary-color">
                        $200.00
                      </Paragraph>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-6 mb-5">
                  <div className="w-[120px] max-sm:w-[110px]">
                    <Image
                      className="w-full h-full object-cover"
                      src={checkoutCart}
                      alt=""
                    />
                  </div>
                  <div className="w-3/5 flex flex-col justify-between">
                    <div>
                      <Paragraph classes="mb-0 max-sm:text-[11px] text-secondary-color opacity-100 font-[500]">
                        Sample Product Image
                      </Paragraph>
                      <Paragraph classes="mb-0 max-sm:text-[11px]">
                        Color: Red
                      </Paragraph>
                      <Paragraph classes="mb-0 max-sm:text-[11px]">
                        Size: L
                      </Paragraph>
                    </div>
                    <div>
                      <Paragraph classes="sm:text-[16px]  mb-0 font-[500] opacity-100 text-secondary-color">
                        $200.00
                      </Paragraph>
                    </div>
                  </div>
                </div>

                <div className="mt-10 max-lg:hidden pt-6 border-t border-secondary-color">
                  <div className="flex mb-2 justify-between">
                    <Paragraph classes="mb-0 opacity-100">Subtotal</Paragraph>
                    <Paragraph classes="mb-0 opacity-100">$400.00</Paragraph>
                  </div>
                  <div className="flex mb-6 justify-between">
                    <Paragraph classes="mb-0 opacity-100">Shipping</Paragraph>
                    <Paragraph classes="mb-0 opacity-100">$400.00</Paragraph>
                  </div>
                  <div className="flex justify-between">
                    <Paragraph classes="mb-0 text-secondary-color font-[500] uppercase opacity-100">
                      Total
                    </Paragraph>
                    <Paragraph classes="mb-0 text-secondary-color font-[500] opacity-100">
                      $400.00
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};

export default Checkout;
