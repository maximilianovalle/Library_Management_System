import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import "./ReportsPage.css";

const ManagerReportsPage = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("maintenance");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/manager_reports`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { dateRange },
        });

        setMaintenanceData(res.data.maintenance_report || []);
        setSalaryData(res.data.salary_report || []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dateRange]);

  const totalSalary = salaryData.reduce((sum, lib) => sum + Number(lib.total_cost), 0);

  const dateRanges = ["week", "month", "quarter", "year", "all"];

  return (
    <div>
      <Header />
      <div className="reports-container">
        <h1 className="report-title">Manager Reports</h1>

        <div className="report-filters">
          <button onClick={() => setActiveReport("maintenance")} className={activeReport === "maintenance" ? "active" : ""}>
            Maintenance Report
          </button>
          <button onClick={() => setActiveReport("salary")} className={activeReport === "salary" ? "active" : ""}>
            Librarian Salary Report
          </button>
        </div>

        <div className="date-filter-container">
          {dateRanges.map((range) => (
            <button
              key={range}
              className={`date-filter-button ${dateRange === range ? "active" : ""}`}
              onClick={() => setDateRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : activeReport === "maintenance" ? (
          <table className="report-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Copy ID</th>
                <th>Title/Model</th>
                <th>Category</th>
                <th>Times Sent to Maintenance</th>
                <th>Last Checked Out</th>
                <th>Borrower</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.length > 0 ? (
                maintenanceData.map((item, i) => (
                  <tr key={i}>
                    <td>{item.item_type}</td>
                    <td>{item.copy_id}</td>
                    <td>{item.title || item.model}</td>
                    <td>{item.category}</td>
                    <td>{item.times_sent_to_maintenance ?? "0"}</td>
                    <td>{item.checkout_date ? new Date(item.checkout_date).toLocaleDateString() : "N/A"}</td>
                    <td>{item.borrower || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7">No maintenance items found.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Hire Date</th>
                  <th>Pay Rate</th>
                  <th>Months Employed</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.length > 0 ? (
                  salaryData.map((lib, index) => (
                    <tr key={index}>
                      <td>{lib.name}</td>
                      <td>{lib.department}</td>
                      <td>{lib.position}</td>
                      <td>{new Date(lib.hire_date).toLocaleDateString()}</td>
                      <td>${lib.pay_rate}</td>
                      <td>{lib.months_employed}</td>
                      <td className="emphasis">${lib.total_cost}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7">No active librarians found.</td></tr>
                )}
              </tbody>
            </table>

            <div className="total-salary">
              <span>Total Salary Paid:</span>
              <span className="salary-amount">${totalSalary.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerReportsPage;