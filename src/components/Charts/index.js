import { Line, Pie } from '@ant-design/charts';
import React from 'react'

function ChartComponent({sortedTransactions}) {
    const data = sortedTransactions.map((item)=>{
        return {date:item.date,amount:item.amount}
    });

  let spendingData= sortedTransactions.filter(
    (transaction)=>{if(transaction.type==="expense"){
        return{tag: transaction.tag, amount: transaction.amount};
  }
});


let newSpendings=[
{tag:"food",amount:0},
{tag:"education",amount:0},
{tag:"office",amount:0},
]
spendingData.forEach((item)=>{
    if(item.tag=="food"){
        newSpendings[0].amount+=item.amount;
    }
    else if(item.tag=="education"){
        newSpendings[1].amount+=item.amount;
    }
    else{
        newSpendings[2].amount+=item.amount;
    }
}); 


    const config = {
    data:data,
    width:500,
    autoFit:false,
    xField: 'date',
    yField: 'amount',
  };

  const spendingConfig = {
    data: newSpendings,
    width:500,
    angleField: "amount",
    colorField: "tag", 
  };

  let chart;
  let pieChart;
  return (
    <div className='charts-wrapper'>
    <div>
        <h2>Your Analytics</h2>
        <Line 
        {...config} 
        onReady={(chartInstance)=>(chart=chartInstance)}
        />;
    </div>
    <div>
        <h2>Your Expenses</h2>
        <Pie  
        {...spendingConfig} 
        onReady={(chartInstance)=>(pieChart=chartInstance)}
        />
    </div>
    </div>
  );
};
    

export default ChartComponent
