# Admin Panel - Dự án Tốt Nghiệp

Dự án admin panel cho hệ thống CRM và web client du lịch 360, được xây dựng bằng Next.js (App Router, TypeScript, TailwindCSS, pnpm).

## Công nghệ sử dụng

- Next.js (bản mới nhất)
- React 19
- TypeScript
- TailwindCSS 4
- pnpm
- ESLint

## Cấu trúc thư mục

```
admin-next/
├── public/                # Static files
├── src/
│   ├── app/               # Next.js App Router (routing, layout, pages)
│   ├── components/        # Component tái sử dụng
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Hàm tiện ích
│   ├── types/             # Định nghĩa TypeScript types/interfaces
│   ├── constants/         # Các hằng số
│   ├── services/          # Giao tiếp API, service layer
│   ├── mocks/             # Mock data cho dev/test
│   └── styles/            # File CSS/Tailwind bổ sung
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

## Hướng dẫn phát triển

1. Cài đặt dependencies:
   ```bash
   pnpm install
   ```
2. Chạy dev:
   ```bash
   pnpm dev
   ```
3. Build production:
   ```bash
   pnpm build
   ```

## Ghi chú

- Dự án admin panel cho hệ thống CRM và web client du lịch 360.
- Ưu tiên tách nhỏ component, sử dụng TailwindCSS cho UI.
- Đảm bảo chuẩn TypeScript và clean code.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
