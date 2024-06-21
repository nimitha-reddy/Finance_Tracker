import React from 'react'
import "./styles.css";
import {Card,Row, theme } from 'antd';
import Button from '../Button';


function Cards({ 
  income,expenses,totalBalance,
    showExpenseModal,
    showIncomeModal}) {
  return (
    <div>
      <Row className='my-row'>
      <Card bordered={true} className="my-card">
        <h2 style={{fontWeight:"0px"}}>Current Balance</h2>
        <p>{totalBalance}</p>
        <div class="btn btn-blue"  >
          Reset Balance
        </div>
      </Card>

      <Card bordered={true} 
      className="my-card"
      onClick={showIncomeModal}
      >
        <h2>Total Income</h2>
        <p> {income} </p>
        <div
          class="btn btn-blue"  
        >
          Add Income
        </div>
      </Card>

      <Card bordered={true} 
      className="my-card"
      onClick={showExpenseModal}
      >
        <h2>Total Expenses</h2>
        <p> {expenses} </p>
        <div className="btn btn-blue"
         >
          Add Expense
        </div>
      </Card> 
        
      </Row>
      
    </div>
  )
}

export default Cards
