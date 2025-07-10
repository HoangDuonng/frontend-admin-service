import React from "react";
import TooltipGlodal from "@/components/tooltipGlodal";
import Overview from "@/components/Overview";
import PopularProducts from "@/components/products";
import Comments from "@/components/comments";
import RefundRequests from "@/components/refundRequests";
import ProTips from "@/components/proTips";
import MoreCustomers from "@/components/customers";
import ProductViews from "@/components/productViews";

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mt-10">
        <div className="flex-[7] space-y-4">
          <Overview className="bg-white rounded-lg shadow p-4" />
          <ProductViews className="bg-white rounded-lg shadow p-4" />
          <ProTips className="bg-white rounded-lg shadow p-4" />
          <MoreCustomers />
        </div>
        <div className="flex-[3] space-y-4">
          <PopularProducts className="bg-white rounded-lg shadow p-4" views="4" />
          <Comments className="bg-white rounded-lg shadow p-4" />
          <RefundRequests title="Refund requests" classTitle="text-red-500" />
        </div>
      </div>
      <TooltipGlodal />
    </>
  );
}
