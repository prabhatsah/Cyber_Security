export interface TabArray {
    tabName: string;
    tabId: string;
    default: boolean;
    tabContent?: React.ReactNode;
    url?: string;
};

export interface TabProps {
    children?: React.ReactNode;
    tabArray: TabArray[];
    tabListClass?: string;
    tabListInnerClass?: string;
    tabListButtonClass?: string;
    tabContentClass?: string;
    headerEndComponent?: React.ReactNode;
    onTabChange?: (tabId: string) => void;
    isSeperatePage?: boolean;
}