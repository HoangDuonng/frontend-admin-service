import { progress } from "@/utils";

export const posts = [
  {
    id: 1,
    title: "Những khách sạn lâu đời nhất tại Sài Gòn: Đẳng cấp và sang trọng",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    date: "2024-05-01",
    status: "published",
    author: "Admin",
    content: [
      {
        type: "heading",
        text: "1. Khách sạn Continental"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        alt: "Khách sạn Continental"
      },
      {
        type: "paragraph",
        text: "Khách sạn Continental là một trong những khách sạn lâu đời nhất Sài Gòn, với hơn 130 năm lịch sử..."
      },
      {
        type: "heading",
        text: "2. Khách sạn Majestic Sài Gòn"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        alt: "Khách sạn Majestic"
      },
      {
        type: "paragraph",
        text: "Khách sạn Majestic là một trong những khách sạn lâu đời nhất Sài Gòn, với bề dày lịch sử gần 100 năm..."
      }
    ]
  },
  {
    id: 2,
    title: "Top 5 lễ hội đặc sắc không thể bỏ lỡ tại TP.HCM",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    date: "2024-04-20",
    status: "draft",
    author: "Editor",
    content: [
      {
        type: "heading",
        text: "1. Lễ hội Ánh sáng"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
        alt: "Lễ hội Ánh sáng"
      },
      {
        type: "paragraph",
        text: "Lễ hội Ánh sáng là sự kiện thu hút hàng ngàn du khách mỗi năm..."
      },
      {
        type: "heading",
        text: "2. Lễ hội Bánh dân gian"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80",
        alt: "Lễ hội Bánh dân gian"
      },
      {
        type: "paragraph",
        text: "Lễ hội Bánh dân gian là dịp để tôn vinh ẩm thực truyền thống..."
      }
    ]
  },
  {
    id: 3,
    title: "Cẩm nang du lịch Sài Gòn cho người mới",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    date: "2024-03-15",
    status: "published",
    author: "Admin",
    content: [
      {
        type: "heading",
        text: "1. Chuẩn bị trước chuyến đi"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        alt: "Chuẩn bị trước chuyến đi"
      },
      {
        type: "paragraph",
        text: "Trước khi đến Sài Gòn, bạn nên chuẩn bị kỹ lưỡng về hành lý, giấy tờ..."
      },
      {
        type: "heading",
        text: "2. Địa điểm không thể bỏ qua"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80",
        alt: "Địa điểm không thể bỏ qua"
      },
      {
        type: "paragraph",
        text: "Những địa điểm nổi bật như Nhà thờ Đức Bà, Bưu điện Thành phố, Chợ Bến Thành..."
      }
    ]
  },
  {
    id: 4,
    title: "Cẩm nang du lịch Sài Gòn cho người mới",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    description: "Tất tần tật kinh nghiệm, mẹo nhỏ và địa điểm không thể bỏ qua khi du lịch Sài Gòn lần đầu tiên.",
    date: "2024-03-15",
    status: "published",
    author: "Admin",
    link: "https://visithcmc.vn/tin-tuc/cam-nang-du-lich-sai-gon"
  },
  {
    id: 5,
    title: "Cẩm nang du lịch Sài Gòn cho người mới",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    description: "Tất tần tật kinh nghiệm, mẹo nhỏ và địa điểm không thể bỏ qua khi du lịch Sài Gòn lần đầu tiên.",
    date: "2024-03-15",
    status: "published",
    author: "Admin",
    link: "https://visithcmc.vn/tin-tuc/cam-nang-du-lich-sai-gon"
  },
  {
    id: 6,
    title: "Cẩm nang du lịch Sài Gòn cho người mới",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    description: "Tất tần tật kinh nghiệm, mẹo nhỏ và địa điểm không thể bỏ qua khi du lịch Sài Gòn lần đầu tiên.",
    date: "2024-03-15",
    status: "published",
    author: "Admin",
    link: "https://visithcmc.vn/tin-tuc/cam-nang-du-lich-sai-gon"
  },
];
