import React from "react";
import './custom-scrollbar.css';

interface DealsListProps {
    dealDetailsTop: any[];
}

const DealsList: React.FC<DealsListProps> = ({ dealDetailsTop }) => {
    let accountManager = "Farouk Said";
    return (
        <div className="mx-auto p-4 border rounded-xl shadow-md">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Top 10 Deals</h2>
            <div className="max-h-[350px] overflow-auto p-3">
                <ul>
                    {dealDetailsTop.map((deal, index) => (
                        <li key={index} className="border-b pb-2 mb-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-blue-600">
                                        {deal.dealName}
                                    </p>
                                    <p className="text-sm ">
                                        Account Manager: <span className="font-bold">{accountManager}</span>
                                    </p>
                                </div>
                                <div className="text-sm ">
                                    <div className="ml-auto text-right">
                                        {deal.dealStartDate}
                                    </div>

                                    {deal.revenue && (
                                        <p className="text-sm">
                                            Actual Revenue: <span className="font-bold">{parseFloat(deal.revenue).toFixed(2)}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DealsList;
