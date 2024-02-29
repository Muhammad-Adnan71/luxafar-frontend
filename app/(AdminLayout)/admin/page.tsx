"use client";

import React, { useEffect } from "react";
import banner from "@public/template/banners.png";
import logo from "@public/template/logo.png";
import Image from "next/image";
import Input from "@template-components/input";
import Button from "@template-components/button";
import CustomLink from "@template-components/link";
import Paragraph from "@template-components/paragraph";
import Link from "next/link";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { LoginUserInput, LoginUserSchema } from "lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "store/useAuthUser";
import { useRouter } from "next/navigation";
import { handleApiError } from "lib/api-helpers";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiLoginUser } from "services/auth";
function LoginPage() {
  const store = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    store.reset();
  }, []);

  async function LoginUserFunction(credentials: LoginUserInput) {
    store.setRequestLoading(true);
    try {
      const response = await apiLoginUser(JSON.stringify(credentials));
      if (response) {
        toast({
          title: "Logged in successfully",
          variant: "success",
        });
        router.push("admin/dashboard");
      }
    } catch (error: any) {
      if (error instanceof Error) {
        handleApiError(error);
      } else {
        toast({
          title: error.message,
        });
      }
    } finally {
      store.setRequestLoading(false);
    }
  }

  const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
    LoginUserFunction(values);
  };
  return (
    <>
      <div className=" min-h-screen relative  overflow-hidden bg-body-pattern bg-primary-color bg-blend-multiply bg-fixed leading-none">
        <div className="flex items-center p-6  min-h-screen bg-[url('/template/water-bg.png')] bg-no-repeat bg-center bg_size">
          <div className="flex-1 h-full max-w-4xl mx-auto  bg-primary-color bg-opacity-60 rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row relative ">
              <div className="relative h-32 md:h-auto md:w-1/2">
                <Image
                  aria-hidden="true"
                  className=" object-cover w-full h-full"
                  src={banner}
                  alt="Office"
                  width={0}
                  height={0}
                />
              </div>
              <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                <div className="w-full">
                  <div>
                    <Image className="mx-auto" src={logo} alt="Luxafar Logo" />
                  </div>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                      <div className="mt-8">
                        <Input placeholder="Email" name="email" />
                      </div>
                      <div className="mt-5">
                        <Input
                          placeholder="*********"
                          name="password"
                          type="password"
                        />
                      </div>

                      <div className="mt-5">
                        <Button
                          isLoading={store.requestLoading}
                          text="Log in"
                          type="button"
                          buttonType="submit"
                          classes="w-full text-center rounded text-sm"
                        />
                      </div>

                      <hr className="my-8 border border-secondary-color" />
                    </form>
                  </FormProvider>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full ">
        <div className="pb-5 mx-auto w-fit">
          <Paragraph
            classes={
              "!mb-0 !text-[11px] max-sm:text-center max-sm:w-[100%] max-sm:mx-auto max-sm:text-[12px]"
            }
          >
            © {new Date().getFullYear()} LUXAFAR. Powered By &nbsp;
            <Link
              className="text-secondary-color !opacity-100 font-extrabold !text-[12x] "
              href="https://ideabox.technology/"
            >
              IDEABOX
            </Link>
          </Paragraph>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
