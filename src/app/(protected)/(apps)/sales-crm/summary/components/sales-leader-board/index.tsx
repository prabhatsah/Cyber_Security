import React from 'react'
import { getRef } from '../../actions';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import BarChartLeadersBoard from '../barChartLeadesBoard';

const allUserDetailMap = async (userId: string) => {
    try {
        const userDetailsMap = await getUserIdWiseUserDetailsMap();
        const userMapObj = Object.values(userDetailsMap)
            .filter((user) => user.userActive && user.userId===userId)
            .map((user)=>user.userName)
        return userMapObj.length? userMapObj[0] : "";
    } catch (error) {
        console.log(error)
    }
}

const getFormattedAmount = (amount: number | string): number => {
    let numericAmount = typeof amount === "number" ? amount : parseFloat(amount);
    if (isNaN(numericAmount)) return 0.00;
    numericAmount = Math.abs(numericAmount);
    return parseFloat(numericAmount.toFixed(2));
};

export default async function SalesLeaderBoard() {

    const ref = getRef();
    console.log(ref.wonDeals)

    let dealLeaderBoardArray: { dealId: string; revenue: number; accountManager: string }[] = [];

    for (let i = 0; i < ref.wonDeals.length; i++) {
        let tempObj: { dealId: string; revenue: number; accountManager: string } = {
            dealId: ref.wonDeals[i].dealIdentifier,
            revenue: ref.wonDeals[i].revenue,
            accountManager: ref.wonDeals[i].accountDetails.accountManager,
        };

        if (Object.keys(tempObj).length !== 0) {
            dealLeaderBoardArray.push(tempObj);
        }
    }

    var tempArray: { sumOfRevenue: number; accountManager: string }[] = [];

    for (let i = 0; i < dealLeaderBoardArray.length; i++) {
        let account = dealLeaderBoardArray[i].accountManager;
        let leaderObject: { sumOfRevenue: number; accountManager: string } = { sumOfRevenue: 0, accountManager: "" };

        for (let j = 0; j < dealLeaderBoardArray.length; j++) {
            if (dealLeaderBoardArray[j].accountManager === account) {
                leaderObject.sumOfRevenue += dealLeaderBoardArray[j].revenue;
                leaderObject.accountManager = dealLeaderBoardArray[j].accountManager;
            }
        }

        tempArray.push(leaderObject);
    }

    var uniqueIds: string[] = [];

    var leaderboardDisplayArray = tempArray.filter((element) => {
        var isDuplicate = uniqueIds.includes(element.accountManager);

        if (!isDuplicate) {
            uniqueIds.push(element.accountManager);
            return true;
        }

        return false;
    });

    leaderboardDisplayArray.sort((a, b) => b.sumOfRevenue - a.sumOfRevenue);

    console.log(leaderboardDisplayArray);

    let chartData = [];

    if(leaderboardDisplayArray.length>5){
			for(var i=0;i<5;i++)
			{
				let obj={
                    name : await allUserDetailMap(leaderboardDisplayArray[i].accountManager),
                    revenue: getFormattedAmount(leaderboardDisplayArray[i].sumOfRevenue)
                };

				// obj.revenue=Globals.GlobalAPI.PreLoader1654244259362.getFormattedAmount(leaderboardDisplayArray[i].sumOfRevenue);
				// var fullName=obj.name.split(' ');
				// var initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
				// obj.initial= initials.toUpperCase();
				chartData.push(obj);
			}
		}
		else{
			for(var i=0;i<leaderboardDisplayArray.length;i++)
			{
                let obj={
                    name : await allUserDetailMap(leaderboardDisplayArray[i].accountManager),
                    revenue: getFormattedAmount(leaderboardDisplayArray[i].sumOfRevenue)
                };
				// var obj={};
				// obj.name=Globals.UserIdWiseUserDetailsMap[leaderboardDisplayArray[i].accountManager] ? Globals.UserIdWiseUserDetailsMap[leaderboardDisplayArray[i].accountManager].userName : "N A";
				// obj.revenue=Globals.GlobalAPI.PreLoader1654244259362.getFormattedAmount(leaderboardDisplayArray[i].sumOfRevenue);
				// var fullName=obj.name.split(' ');
				// var initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
				// obj.initial= initials.toUpperCase();
				chartData.push(obj);
			}
		}

        chartData = chartData.filter((data)=> data.revenue);
        console.log(chartData)
    return (
        <div>
            <BarChartLeadersBoard salesLeaderBoard={chartData} /> 
        </div>
    )
}
