import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { publicRequest } from "./requestMethods";
function App() {
  const [addExpense, setAddExpense] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [update, setUpdate] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setValue] = useState(0);
  const [date, setDate] = useState("");
  const [id, setID] = useState(null);

  const handleAddExpense = () => {
    setAddExpense(!addExpense);
  };

  const handleShowChart = () => {
    setShowChats(!showChats);
  };
  const handleUpdate = () => {
    setUpdate(!update);
  };
  const handleShowDelete = (Id) => {
    setShowDelete(!showDelete);
    setID(Id);
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

  const handleDelete = async () => {
    if (id) {
      try {
        await publicRequest.delete(`/expenses/${id}`);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
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
              </div>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="search"
              className="p-[10px] w-[150px] border-2 border-[#444] border-solid"
            />
          </div>
        </div>
        <div className="flex flex-col">
          {expenses?.map((expense, index) => (
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
                    onClick={() => handleShowDelete(expense._id)}
                  />
                  <FaEdit
                    className="text-[#555] my-[10px] cursor-pointer"
                    onClick={handleUpdate}
                  />
                </div>
                {showDelete && (
                  <div className="absolute z-[999] top-0 right-0 bg-white flex p-[10px] h-[300px] w-[300px] shadow-xl">
                    <div className="flex justify-center items-center">
                      <button
                        className="mr-10 bg-[#aaa] p-[10px] w-[100px] cursor-pointer font-medium"
                        onClick={handleShowDelete}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#e43737] text-white border-none p-[10px] w-[100px] cursor-pointer font-medium"
                        onClick={handleDelete}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
                {update && (
                  <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] right-0 h-[500px] w-[500px] bg-white shadow-xl">
                    <FaWindowClose
                      className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
                      onClick={handleUpdate}
                    />
                    <label
                      htmlFor=""
                      className="mt-[10px]font-semibold text-[18px]"
                    >
                      Expense Name
                    </label>
                    <input
                      type="text"
                      placeholder="Birthday"
                      className="border-[#444]  p-[10px] outline-none"
                    />
                    <label
                      htmlFor=""
                      className="mt-[10px] font-semibold text-[18px]"
                    >
                      Expense Amount
                    </label>
                    <input
                      type="Number"
                      placeholder="300"
                      className="p-[10px] outline-none"
                    />
                    <label
                      htmlFor=""
                      className="mt-[10px] font-semibold text-[18px]"
                    >
                      Expense Date
                    </label>
                    <input
                      type="text"
                      placeholder="20/11/2024"
                      className="p-[10px] outline-none"
                    />

                    <button className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-10">
                      Update Expense
                    </button>
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
