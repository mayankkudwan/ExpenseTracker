# Expense Tracker
## Overview
Expense Tracker is a MERN stack project designed to help you manage and track your expenses efficiently. 
With this application, you can add expenses and view them in the form of a pie chart.
Additionally, it features background services that send an email notification to your Gmail account if you exceed your monthly budget, 
providing a timely warning to help you stay within your financial limits.

## Features
- **Add Expenses**: Easily add your daily expenses to the tracker.
- **View Expenses as Pie Chart**: Visualize your expenses in a pie chart to understand your spending habits better.
- **Background Services**: Receive email notifications if you exceed your monthly budget, ensuring you stay informed about your spending.
- **MERN Stack**: Built with MongoDB, Express, React, and Node.js for a seamless and efficient user experience.

## Technologies Used
- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB

### Install Dependencies

Backend:
```bash
cd Backend
npm install
```

Frontend:
```bash
cd expense-tracker
npm install
```

## How to Run

To start the frontend server, run:
```bash
cd expense-tracker
npm run dev
``` 

To start the backend server, run:
```bash
cd Backend
nodemon index.js
```

## Usage
1. **Adding Expenses**: On the homepage, you can add your expenses by filling out the form with the expense details and clicking the "Add Expense" button.

2. **Viewing Expenses**: Switch to the "View Expenses" tab to see a pie chart representation of your expenses.

3. **Email Notifications**: The background service runs periodically to check your total expenses for the month. If you exceed your budget, you will receive an email notification warning you about the overspending.
