export interface HeaderLogo {
    src: string;
    alt: string;
    width: number;
    height: number;
    href: string;
}

export interface HeaderNavItem {
    title: string;
    href: string;
    isActive: boolean;
}
    
export interface HeaderLanguage {
    value: string;
    label: string;
}

export interface HeaderLayout {
    logo: HeaderLogo;
    navigation: HeaderNavItem[];
    languages: HeaderLanguage[];
}
