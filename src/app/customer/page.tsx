import React from 'react';
import Overview from '@/components/customers/Overview';
import TrafficChannel from '@/components/customers/TrafficChannel';
import ActiveCustomers from '@/components/customers/ActiveCustomers';
import ShareProducts from '@/components/customers/ShareProducts';
import RefundRequests from '@/components/refundRequests';
import TopDevice from '@/components/customers/TopDevice';
import TopCountry from '@/components/customers/TopCountry';
import Message from '@/components/customers/Message';
// import NewCustomer from '@/components/customers/NewCustomer';

const Customers = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-1 lg:pr-2">
                <div className="mb-2">
                    <Overview />
                </div>
                <div className="mb-2">
                    <TrafficChannel />
                </div>
                <div className="mb-2">
                    <ActiveCustomers />
                </div>
                <div className="mb-2">
                    <ShareProducts />
                </div>
            </div>
            <div className="w-full lg:w-[340px] xl:w-[312px]">
                <div className="mb-2">
                    <RefundRequests
                        title="Refund requests"
                        classTitle="title-red"
                    />
                </div>
                <div className="mb-2">
                    <TopDevice />
                </div>
                <div className="mb-2">
                    <TopCountry />
                </div>
                <div className="mb-2">
                    <Message />
                </div>
                <div className="mb-2">
                    {/* <NewCustomer /> */}
                </div>
            </div>
        </div>
    );
};

export default Customers; 