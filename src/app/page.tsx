import { getUsers } from "@/services/userService";
import { getHotels } from "@/services/hotelService";
import { getTours } from "@/services/tourService";
import { getBanners } from "@/services/bannerService";
import { getRoles, getPermissions } from "@/services/rolePermissionService";
import OverviewCardsClient from "@/components/dashboard/OverviewCardsClient";
import DashboardChartsClient from "@/components/dashboard/DashboardChartsClient";
import LatestListClient from "@/components/dashboard/LatestListClient";

export const dynamic = 'force-dynamic'; 

export default async function Home() {
  
  // Fetch users
  // const userRes = await getUsers(1, 100);
  // const users = userRes.data || [];
  // const userCount = users.length;
  // const latestUsers = users.slice(-5).reverse();
  // // Chart: users theo tháng
  // const userByMonth = {} as Record<string, number>;
  // users.forEach(u => {
  //   if (u.createdAt) {
  //     const d = new Date(u.createdAt);
  //     const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  //     userByMonth[key] = (userByMonth[key] || 0) + 1;
  //   }
  // });
  // const userChartData = Object.entries(userByMonth).map(([k, v]) => ({ name: k, value: v }));

  // // Fetch hotels
  // const hotels = await getHotels();
  // const hotelCount = hotels.length;
  // const latestHotels = hotels.slice(-5).reverse();
  // const hotelByMonth = {} as Record<string, number>;
  // hotels.forEach(h => {
  //   if (h.createdAt) {
  //     const d = new Date(h.createdAt);
  //     const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  //     hotelByMonth[key] = (hotelByMonth[key] || 0) + 1;
  //   }
  // });
  // const hotelChartData = Object.entries(hotelByMonth).map(([k, v]) => ({ name: k, value: v }));

  // // Fetch tours
  // const tours = await getTours();
  // const tourCount = tours.length;
  // const latestTours = tours.slice(-5).reverse();
  // const tourByMonth = {} as Record<string, number>;
  // tours.forEach(t => {
  //   if (t.createdAt) {
  //     const d = new Date(t.createdAt);
  //     const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  //     tourByMonth[key] = (tourByMonth[key] || 0) + 1;
  //   }
  // });
  // const tourChartData = Object.entries(tourByMonth).map(([k, v]) => ({ name: k, value: v }));

  // // Fetch banners
  // const banners = await getBanners();
  // const bannerCount = banners.length;
  // // Fetch roles
  // const roles = await getRoles();
  // const roleCount = roles.length;
  // // Fetch permissions
  // const permissions = await getPermissions();
  // const permissionCount = permissions.length;

  return (
    <div className="flex flex-col gap-8 mt-10">
      <OverviewCardsClient
        userCount={0}
        hotelCount={0}
        tourCount={0}
        bannerCount={0}
        roleCount={0}
        permissionCount={0}
      />
      <DashboardChartsClient
        userChartData={[]}
        hotelChartData={[]}
        tourChartData={[]}
      />
      <LatestListClient
        latestUsers={[]}
        latestHotels={[]}
        latestTours={[]}
      />
    </div>
  );
}
