
export interface FooterLogoMeta {
    url: string;
    context?: string;
    entityId?: string;
    filename?: string;
    [key: string]: any;
}

export interface FooterSocialLink {
    type: 'facebook' | 'instagram' | 'youtube' | 'twitter' | string;
    url: string;
}

export interface FooterQuickLink {
    label: string;
    url: string;
}

export interface FooterNewsletter {
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
}

export interface FooterLayout {
    logo: FooterLogoMeta;
    description: string;
    socials: FooterSocialLink[];
    quickLinks: FooterQuickLink[];
    newsletter: FooterNewsletter;
    copyright: string;
}
