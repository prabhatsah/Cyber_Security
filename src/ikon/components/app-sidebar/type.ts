
export interface MenuItem {
    title: string;
    submenu?: MenuItem[]; // Nested submenu items
    href?: string;
    iconName?: string;
}