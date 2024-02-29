import Link from "next/link";
import routes, { routeIsActive } from "routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";
import { usePathname } from "next/navigation";
import { pageLinkRemoveExtraSpaces } from "lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";
import { useEffect, useState } from "react";
import { apiGetAllPagesService } from "services/pages";
import { apiDashboard } from "services/dashboard";
import { FormResponse, PageResponse } from "lib/types";
import Counter from "./counter";

interface ISidebarContent {
  linkClicked: () => void;
  minimizeMenu: boolean;
}

function SidebarContent({ linkClicked, minimizeMenu }: ISidebarContent) {
  const pathname = usePathname();
  const [pageData, setPageData] = useState<PageResponse[]>([]);
  const [forms, setForms] = useState<FormResponse[]>([]);
  const [beSpokeCount, setBespokeCount] = useState(0);
  const [becomePartnerCount, setBecomePartnerCount] = useState(0);

  const apiGetAllPages = async () => {
    const response = await apiDashboard();
    if (response?.status === "success") {
      setPageData(response.data.pages);
      setForms(response.data.forms);
      setBecomePartnerCount(response.data.becomePartner);
      setBespokeCount(response.data.bespokeCount);
    }
  };

  useEffect(() => {
    apiGetAllPages();
  }, []);

  const updatedRoutes = routes.map((route: any) => {
    if (route.name === "Pages") {
      return {
        ...route,
        routes: pageData.map((page: any) => {
          return {
            path: pageLinkRemoveExtraSpaces(page.name, page.id, "pages"),
            name: page.name,
          };
        }),
      };
    } else if (route.name === "Forms") {
      const formCounts = {
        contact: 0,
        bespokePlan: 0,
        booking: 0,
        newsLetter: 0,
        becomePartner: 0,
      };
      forms.forEach((obj) => {
        const type = obj.type;
        if (obj.status === "unread")
          if (formCounts[type]) {
            formCounts[type]++;
          } else {
            formCounts[type] = 1;
          }
      });

      return {
        ...route,
        routes: [
          {
            path: "/admin/forms/bespoke",
            name: "Bespoke Plan",
            render: () => (
              <span className="flex justify-between items-center">
                Bespoke Plan{" "}
                {beSpokeCount > 0 && <Counter count={beSpokeCount} />}
              </span>
            ),
          },
          {
            path: "/admin/forms?type=booking",
            name: "Booking",
            render: () => (
              <span className="flex justify-between items-center">
                Booking{" "}
                {formCounts.booking > 0 && (
                  <Counter count={formCounts.booking} />
                )}
              </span>
            ),
          },
          {
            path: "/admin/forms?type=contact",
            name: "Contact",
            render: () => (
              <span className="flex justify-between items-center">
                Contact{" "}
                {formCounts.contact > 0 && (
                  <Counter count={formCounts.contact} />
                )}
              </span>
            ),
          },
          {
            path: "/admin/forms?type=newsletter",
            name: "Newsletters ",
            render: () => (
              <span className="flex justify-between items-center">
                Newsletters{" "}
                {formCounts.newsLetter > 0 && (
                  <Counter count={formCounts.newsLetter} />
                )}
              </span>
            ),
          },
          {
            path: "/admin/forms/becomePartner",
            name: "Become Partner",
            render: () => (
              <span className="flex justify-between items-center">
                Become Partner{" "}
                {becomePartnerCount > 0 && (
                  <Counter count={becomePartnerCount} />
                )}
              </span>
            ),
          },
        ],
      };
    } else return route;
  });

  return (
    <div className="text-white dark:text-gray-200 ">
      <ul className="h-[calc(100vh_-_81px)] overflow-scroll pb-10">
        {updatedRoutes.map((route) =>
          route.routes ? (
            <SidebarSubmenu
              route={route}
              key={route.name}
              linkClicked={linkClicked}
              minimizeMenu={minimizeMenu}
            />
          ) : (
            <li
              className={`relative px-6 py-3 h-[50px] flex items-center`}
              key={route.name}
            >
              {routeIsActive(pathname, route) && (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-cms-secondary-color rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              )}
              <Link
                className={`inline-flex   items-center w-full text-sm font-semibold transition-all  duration-150 hover:text-cms-secondary-color   ${
                  routeIsActive(pathname, route)
                    ? "  text-cms-secondary-color"
                    : ""
                }`}
                onClick={linkClicked}
                href={route.path || "#"}
                scroll={false}
              >
                <span className="inline-flex items-center">
                  {minimizeMenu && (
                    <HoverCard openDelay={300}>
                      <HoverCardTrigger>{route.icon()}</HoverCardTrigger>
                      <HoverCardContent className="px-3 py-2 text-xs  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                        {route.name}
                      </HoverCardContent>
                    </HoverCard>
                  )}
                  {!minimizeMenu && route?.icon && route?.icon()}
                  <span
                    className={`ml-4  ${
                      minimizeMenu
                        ? "translate-x-20 opacity-0"
                        : "-translate-x-0"
                    }`}
                  >
                    {route.name}
                  </span>
                </span>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default SidebarContent;
