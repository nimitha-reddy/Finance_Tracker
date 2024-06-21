import React,{useEffect, useState} from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import {getDocs, addDoc, collection, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
  /*const transaction=[{
    type:"income",
    amount:1200,
    tag:"salary",
    name:"icome 1",
    date:"2023-05-23",
  },
  {
    type:"expense",
    amount:800,
    tag:"food",
    name:"expense 1",
    date:"2024-05-23",
  }
]*/
    const[loading,setLoading]=useState(false);
    const [transactions, setTransactions] = useState([]);
    const [user]=useAuthState(auth)
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const[income,setIncome]=useState(0);
    const[expenses,setExpenses]=useState(0);
    const[totalBalance,setTotalBalance]=useState(0);
    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
      };
    
      const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
      };
    
      const handleExpenseCancel = () => {
        setIsExpenseModalVisible(false);
      };
    
      const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
      };

      useEffect(()=>{
        fetchTransactions()
      },[user]);

      const onFinish = (values, type) => {
        const newTransaction = {
          type: type,
          date: (values.date).format("YYYY-MM-DD"),
          amount: parseFloat(values.amount),
          tag: values.tag,
          name: values.name,
        };
    
        addTransaction(newTransaction);
      };

      const calculateBalance = () => {
        let incomeTotal = 0;
        let expensesTotal = 0;
    
        transactions.forEach((transaction) => {
          if (transaction.type === "income") {
            incomeTotal += transaction.amount;
          } else {
            expensesTotal += transaction.amount;
          }
        });
    
        setIncome(incomeTotal);
        setExpenses(expensesTotal);
        setTotalBalance(incomeTotal - expensesTotal);
      };

      useEffect(() => {
        calculateBalance();
      }, [transactions]);
      
      async function addTransaction(transaction, many) {
        try {
          const docRef = await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
          );
          console.log("Document written with ID: ", docRef.id);
        
          if(!many)  toast.success("Transaction Added!");
            let newArr=transactions;
            newArr.push(transaction);
            setTransactions(newArr);
            calculateBalance();
        } catch (e) {
          console.error("Error adding document: ", e);
          if (!many) {
            toast.error("Couldn't add transaction");
          }
        }
      }

      async function fetchTransactions() {
        setLoading(true);
        if (user) {
          const q = query(collection(db, `users/${user.uid}/transactions`));
          const querySnapshot = await getDocs(q);
          let transactionsArray = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            transactionsArray.push(doc.data());
          });
          setTransactions(transactionsArray);
          toast.success("Transactions Fetched!");
        }
        setLoading(false);
      }
      let sortedTransactions=transactions.sort((a,b)=>{
            return new Date(a.date) - new Date(b.date);
        }
      )




    return (
    <div>
    <Header/>
    {loading ? (<p>Loading...</p>):(
    <>
    <Cards 
    income={income}
    expenses={expenses}
    totalBalance={totalBalance}
    showExpenseModal={showExpenseModal} 
    showIncomeModal={showIncomeModal}
    />
    {transactions && transactions.length!=0?(<ChartComponent sortedTransactions={sortedTransactions} totalBalance={totalBalance}/>):(<NoTransactions/>)}
    <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable 
          transactions={transactions} 
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
          />
        </>
        )}
    </div>
  )
}

export default Dashboard
