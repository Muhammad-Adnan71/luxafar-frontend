/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

import {
  ChatBubbleIcon,
  GearIcon,
  HamburgerMenuIcon,
  HomeIcon,
  LayoutIcon,
  PersonIcon,
  QuoteIcon,
  ReaderIcon,
  TableIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import Counter from "components/CMS/components-ui/sidebar/counter";
import { ClipboardEdit, HeartHandshake, MapPin, Palmtree } from "lucide-react";

interface IRoute {
  path?: string;
  icon?: Function;
  name: string;
  render?: () => any;
  routes?: IRoute[];
  checkActive?(pathname: String, route: IRoute): boolean;
  exact?: boolean;
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname == route?.path
    : route?.path
    ? pathname.indexOf(route.path) === 0
    : false;
}

const routes: IRoute[] = [
  {
    path: "/admin/dashboard", // the url
    icon: () => <HomeIcon className="w-5 h-5" />, // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
    exact: true,
  },
  {
    icon: () => <LayoutIcon className="w-5 h-5" />,
    name: "Pages",
    path: "/admin/pages",
    exact: true,
    routes: [],
  },

  {
    name: "Destinations",
    icon: () => <MapPin className="w-5 h-5" />,
    path: "/admin/destinations",
    exact: true,
    routes: [
      {
        path: "/admin/destinations/tours",
        name: "Tours",
      },
      {
        path: "/admin/destinations/things-to-do",
        name: "Things To Do",
      },
      {
        path: "/admin/destinations/places-to-visit",
        name: "Places To Visit",
      },
      {
        path: "/admin/destinations/season-to-visit",
        name: "Seasons To Visit",
      },
      {
        path: "/admin/destinations/gallery",
        name: "Gallery",
      },
      {
        path: "/admin/destinations/plan-services",
        name: "Plan Services",
      },
      {
        path: "/admin/destinations/features",
        name: "Features",
      },
    ],
  },
  {
    path: "/admin/holiday-types",
    name: "Holiday Types",
    icon: () => <Palmtree className="w-5 h-5" />,
  },
  {
    path: "/admin/inspirations",
    name: "Inspirations",
    icon: () => <ReaderIcon className="w-5 h-5" />,
  },

  {
    path: "/admin/banner",
    icon: () => <TableIcon className="w-5 h-5" />,
    name: "Banner",
  },
  {
    path: "/admin/partners",
    name: "Partners",
    icon: () => <HeartHandshake className="w-5 h-5" />,
  },

  {
    path: "/admin/testimonials",
    name: "Testimonials",
    icon: () => <QuoteIcon className="w-5 h-5" />,
  },
  {
    path: "/admin/forms",
    name: "Forms",
    icon: () => <ClipboardEdit className="w-5 h-5" />,
    routes: [
      {
        path: "/admin/destinations/tours",
        name: "Bespoke Plan",
        render: () => (
          <span className="flex justify-between items-center">
            Bespoke Plan <Counter count={5} />
          </span>
        ),
      },
      {
        path: "/admin/destinations/thingstodo",
        name: "Booking",
        render: () => (
          <span className="flex justify-between items-center">
            Booking <Counter count={18} />
          </span>
        ),
      },
      {
        path: "/admin/destinations/placestovisit",
        name: "Contact",
        render: () => (
          <span className="flex justify-between items-center">
            Contact <Counter count={17} />
          </span>
        ),
      },
      {
        path: "/admin/destinations/seasontovisit",
        name: "Newsletters ",
        render: () => (
          <span className="flex justify-between items-center">
            Newsletters <Counter count={12} />
          </span>
        ),
      },
    ],
  },

  {
    path: "/admin/faqs",
    name: "Faqs",
    icon: () => <ChatBubbleIcon className="w-5 h-5" />,
  },

  {
    path: "/admin/configuration",
    icon: () => <GearIcon className="w-5 h-5" />,
    name: "Configuration/Settings",
  },
];

export type { IRoute };
export default routes;
