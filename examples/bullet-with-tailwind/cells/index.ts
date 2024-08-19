import { Cell } from '@adbl/cells';

export const sidebarIsOpen = Cell.source(false);
export const toggleSidebar = () => {
  sidebarIsOpen.value = !sidebarIsOpen.value;
};
