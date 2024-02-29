import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import successIcon from "@public/template/success.png";
import Image from "next/image";
import Subheading from "@template-components/sub-heading";
import Paragraph from "@template-components/paragraph";

export default function Success({
  title,
  message,
  isModalOpen,
  setIsModalOpen,
}: {
  title?: string;
  message?: string;
  isModalOpen: boolean;
  setIsModalOpen: Function;
}) {
  return (
    <Dialog.Root
      onOpenChange={() => {
        setIsModalOpen(false);
      }}
      open={isModalOpen}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-[black] z-50 bg-opacity-[0.447] data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-[51] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] py-10 max-sm:py-[15px] w-3/5 max-sm:w-4/5 max-[400px]:px-[15px] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-primary-color p-8 max-sm:p-[30px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none max-sm:overflow-y-auto">
          <button
            className="text-secondary-color hover:bg-quaternary-color focus:shadow-cms-secondary-color absolute top-[25px] max-sm:right-[10px] max-sm:hidden right-[25px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_1px] focus:outline-none items-center "
            aria-label="Close"
            onClick={() => setIsModalOpen(false)}
          >
            <Cross1Icon className="w-3 h-3" />
          </button>
          <div className="text-center mx-auto">
            <div className="mx-auto max-sm:w-[60px] w-[80px]">
              <Image
                src={successIcon}
                alt="success Icon"
                className="w-full h-full max-sm:h-auto"
              />
            </div>
            <Subheading
              classes={
                "pt-4 sm:text-[26px] max-sm:mb-0 max-sm:leading-[1] max-sm:text-[24px]  font-[500]"
              }
            >
              {title ?? "Thank You For Subscribing!"}
            </Subheading>
            <Paragraph classes="font-[400] max-sm:hidden sm:text-[13px] max-sm:text-[11px] max-[400px]:text-[10px] mb-0">
              {message ??
                "Thank you for subscribing to our newsletter. Please check your inbox for our latest updates."}
            </Paragraph>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
