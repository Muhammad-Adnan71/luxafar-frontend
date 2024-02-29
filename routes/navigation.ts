import { WEB_ROUTES } from "lib/utils";

export interface IHeaderNav {
  label: string;
  path: string;
  hasChildren?: boolean;
}

export const headerNavigation: IHeaderNav[] = [
  { label: "bespoke holidays", path: WEB_ROUTES.BESPOKE_HOLIDAY },
  { label: "destinations", path: WEB_ROUTES.DESTINATION, hasChildren: true },
  { label: "tours", path: WEB_ROUTES.TOURS },
  { label: "holiday types", path: WEB_ROUTES.HOLIDAY_TYPES },
  { label: "inspirations", path: WEB_ROUTES.INSPIRATIONS },
  { label: "shop", path: "" },
  { label: "contact", path: WEB_ROUTES.CONTACT },
];
