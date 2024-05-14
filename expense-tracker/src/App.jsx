import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { publicRequest } from "./requestMethods";

function App() {
  const [addExpense, setAddExpense] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [update, setUpdate] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setValue] = useState(0);
  const [date, setDate] = useState("");
  const [updatedId, setUpdatedID] = useState(null);
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const handleAddExpense = () => {
    setAddExpense(!addExpense);
  };

  const handleShowChart = () => {
    setShowChats(!showChats);
  };

  const handleUpdate = (id) => {
    setUpdatedID(id);
    setUpdate(!update);
  };

  const handleExpense = async () => {
    try {
      await publicRequest.post("/expenses", {
        label,
        date,
        value: amount,
      });
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
    <div>
      <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mr-[5%] ml-[5%]">
        <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>
        <div className="flex items-center justify-between mt-5 w-[100%]">
          <div className="relative flex justify-between w-[300px]">
            <button
              className="bg-[#af8978] p-[10px] border-none outline-none cursor-pointer text-[#fff] text-medium"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button
              className="bg-blue-300 cursor-pointer p-[10px] text-[#fff]"
              onClick={handleShowChart}
            >
              Expense Report
            </button>

            {addExpense && (
              <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-0 h-[500px] w-[500px] bg-white shadow-xl">
                <FaWindowClose
                  className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
                  onClick={handleAddExpense}
                />
                <label
                  htmlFor=""
                  className="mt-[10px]font-semibold text-[18px]"
                >
                  Expense Name
                </label>
                <input
                  type="text"
                  placeholder="Snacks"
                  className="border-[#444]  p-[10px] outline-none"
                  onChange={(e) => setLabel(e.target.value)}
                />
                <label
                  htmlFor=""
                  className="mt-[10px] font-semibold text-[18px]"
                >
                  Expense Amount
                </label>
                <input
                  type="Number"
                  placeholder="Snacks"
                  className="p-[10px] outline-none"
                  onChange={(e) => setValue(e.target.value)}
                />
                <label
                  htmlFor=""
                  className="mt-[10px] font-semibold text-[18px]"
                >
                  Expense Date
                </label>
                <input
                  type="date"
                  placeholder="Snacks"
                  className="p-[10px] outline-none"
                  onChange={(e) => setDate(e.target.value)}
                />

                <button
                  className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-10"
                  onClick={handleExpense}
                >
                  Add Expense
                </button>
              </div>
            )}

            {showChats && (
              <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-[100px] h-[500px] w-[500px] bg-white shadow-xl">
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
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 180,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                />
                <div>
                  <strong>Total Expenses:</strong> ${totalSum}
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              className="p-[10px] w-[150px] border-2 border-[#444] border-solid"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          {filteredExpenses.map((expense, index) => (
            <>
              <div
                className="relative flex justify-between items-center w-[80vw] h-[100px] bg-[#f3edeb] my-[20px] py-[10px]"
                key={index}
              >
                <h2 className="m-[20px] text-[#555] text-[18px] font-medium">
                  {expense.label}
                </h2>
                <h2 className="m-[20px] text-[18px]">{expense.date}</h2>
                <h2 className="m-[20px] text-[18px] font-medium">
                  ${expense.value}
                </h2>

                <div>
                  <FaTrash
                    className="text-red-500 mr-[10px] cursor-pointer"
                    onClick={() => handleDelete(expense._id)}
                  />
                  <FaEdit
                    className="text-[#555] my-[10px] cursor-pointer"
                    onClick={() => handleUpdate(expense._id)}
                  />
                </div>
              </div>
            </>
          ))}
        </div>

        {update && (
          <div className="absolute z-[999] flex flex-col p-[10px] top-[25%] right-0 h-[500px] w-[500px] bg-white shadow-xl">
            <FaWindowClose
              className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
              onClick={handleUpdate}
            />
            <label htmlFor="" className="mt-[10px]font-semibold text-[18px]">
              Expense Name
            </label>
            <input
              type="text"
              placeholder="Birthday"
              className="border-[#444]  p-[10px] outline-none"
              onChange={(e) => setUpdatedLabel(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Amount
            </label>
            <input
              type="Number"
              placeholder="300"
              className="p-[10px] outline-none"
              onChange={(e) => setUpdatedAmount(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Date
            </label>
            <input
              type="text"
              placeholder="20/11/2024"
              className="p-[10px] outline-none"
              onChange={(e) => setUpdatedDate(e.target.value)}
            />

            <button
              className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-10"
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

export default App;
