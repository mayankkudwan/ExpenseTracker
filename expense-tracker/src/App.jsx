import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { publicRequest } from "./requestMethods";

function App() {
  const [addExpense, setAddExpense] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [update, setUpdate] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [updatedId, setUpdatedID] = useState(null);
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddExpense = () => setAddExpense(!addExpense);
  const handleShowChart = () => setShowCharts(!showCharts);
  const handleUpdate = (id) => {
    setUpdatedID(id);
    setUpdate(!update);
  };

  const handleExpense = async () => {
    try {
      await publicRequest.post("/expenses", { label, date, value: amount });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        setExpenses(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const updateExpense = async () => {
    if (updatedId) {
      try {
        await publicRequest.put(`/expenses/${updatedId}`, {
          value: updatedAmount,
          label: updatedLabel,
          date: updatedDate,
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSum = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-200 min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-5 bg-violet-500 p-4 rounded-2xl">Expense Tracker</h1>
        <div className="grid gap-4 w-full sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 ml-4 ">
          <Controls
            addExpense={addExpense}
            showCharts={showCharts}
            handleAddExpense={handleAddExpense}
            handleShowChart={handleShowChart}
            setLabel={setLabel}
            setAmount={setAmount}
            setDate={setDate}
            handleExpense={handleExpense}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            totalSum={totalSum}
            expenses={expenses}
          />
        </div>
        <div className="flex mt-10 w-full px-4 text-2xl">
          <input
            type="text"
            placeholder="Search"
            className="px-2 py-3 w-full border-2 border-gray-700 border-solid bg-gray-300 rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid gap-4 w-full mt-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 ml-10 mr-10">
          {filteredExpenses.map((expense, index) => (
            <ExpenseItem
              key={index}
              expense={expense}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))}
        </div>
        {update && (
          <div className="absolute z-50 flex flex-col p-4 top-[25%] right-0 h-[500px] w-full bg-white shadow-xl md:w-[500px]">
            <FaWindowClose
              className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
              onClick={handleUpdate}
            />
            <label className="mt-2 font-semibold text-lg">Expense Name</label>
            <input
              type="text"
              placeholder="Birthday"
              className="border-gray-700 p-2 outline-none"
              onChange={(e) => setUpdatedLabel(e.target.value)}
            />
            <label className="mt-2 font-semibold text-lg">Expense Amount</label>
            <input
              type="Number"
              placeholder="300"
              className="p-2 outline-none"
              onChange={(e) => setUpdatedAmount(e.target.value)}
            />
            <label className="mt-2 font-semibold text-lg">Expense Date</label>
            <input
              type="date"
              className="p-2 outline-none"
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
            <button
              className="bg-[#af8978] text-xl text-white p-2 border-none cursor-pointer my-4"
              onClick={updateExpense}
            >
              Update Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const Controls = ({
  addExpense,
  showCharts,
  handleAddExpense,
  handleShowChart,
  setLabel,
  setAmount,
  setDate,
  handleExpense,
  setSearchTerm,
  searchTerm,
  totalSum,
  expenses,
}) => (
  <div className="grid gap-4 w-full">
    <div className="relative flex justify-between w-full gap-4">
      <button
        className="rounded-2xl bg-blue-300 px-4 py-2 border-none outline-none cursor-pointer text-black font-bold  px-10 py-4 text-2xl"
        onClick={handleAddExpense}
      >
        Add&nbsp;Expense
      </button>
      <button
        className="rounded-2xl bg-red-300 cursor-pointer px-4 py-2 text-black font-bold text-2xl "
        onClick={handleShowChart}
      >
        Expense&nbsp;Report
      </button>

      {addExpense && (
        <div className="bg-gray-300 absolute z-50 flex flex-col p-4 top-20 left-0 h-[500px] w-full bg-white shadow-xl md:w-[500px]">
          <FaWindowClose
            className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
            onClick={handleAddExpense}
          />
          <label className="border bg-red-200 mt-2 font-bold text-xl px-4 py-2">
            Expense Name
          </label>
          <input
            type="text"
            placeholder="Snacks"
            className="border rounded-2xl mt-2 p-2"
            onChange={(e) => setLabel(e.target.value)}
          />
          <label className="border bg-red-200 mt-2 font-bold text-xl px-4 py-2">
            Expense Amount
          </label>
          <input
            type="Number"
            placeholder="100"
            className="border rounded-2xl mt-2 p-2"
            onChange={(e) => setAmount(e.target.value)}
          />
          <label className="border bg-red-200 mt-2 font-bold text-xl px-4 py-2">
            Expense Date
          </label>
          <input
            type="date"
            className="border rounded-2xl mt-2 p-2"
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="bg-[#af8978] text-xl text-white p-2 border-none cursor-pointer my-4 md:text-2xl"
            onClick={handleExpense}
          >
            Add Expense
          </button>
        </div>
      )}

      {showCharts && (
        <div className="absolute z-50 flex flex-col p-4 top-20 left-0 h-[500px] w-full bg-white shadow-xl md:w-[500px] md:left-[100px]">
          <FaWindowClose
            className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
            onClick={handleShowChart}
          />
          <PieChart
            series={[
              {
                data: expenses,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 0,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 180,
                cx: 150,
                cy: 150,
              },
            ]}
          />
          <div>
            <strong className="bg-gray-400 rounded-2xl px-4 py-2">
              Total Expenses:
            </strong>{" "}
            ${totalSum}
          </div>
        </div>
      )}
    </div>
  </div>
);

const ExpenseItem = ({ expense, handleDelete, handleUpdate }) => (
  <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">{expense.label}</h2>
      <div className="flex space-x-2">
        <FaEdit
          className="text-blue-500 cursor-pointer"
          onClick={() => handleUpdate(expense._id)}
        />
        <FaTrash
          className="text-red-500 cursor-pointer"
          onClick={() => handleDelete(expense._id)}
        />
      </div>
    </div>
    <p className="mt-2">Date: {expense.date}</p>
    <p className="mt-2">Amount: ${expense.value}</p>
  </div>
);

export default App;
