import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { fs } from "layouts/authentication/firebase";
import domtoimage from "dom-to-image";

import { Chart, PieController, CategoryScale, ArcElement } from 'chart.js';

Chart.register(PieController, CategoryScale, ArcElement);

const PieChart = (value) => {
  useEffect(async () => {

    let datainfo = {};
    await getDocs(collection(fs, "kshitij", "February Expense", "transactions"))
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc);
        });

        // Group by key and sum amounts
        console.log(data);
        const groupedData = data.reduce((acc, curr) => {
          const key = curr.data().option; // Replace 'option' with your actual key
          const amount = parseInt(curr.data().amount); // Replace 'amount' with your actual amount field

          if (!acc[key]) {
            acc[key] = 0;
          }

          acc[key] += amount;

          console.log(acc)
          return acc;
        }, {});

        datainfo = groupedData;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    console.log(datainfo);
    // Your income and expenses data
    var totalIncome = value.income; // Replace this with your actual total income
    var expensesData = {
        rent: datainfo.education,
        groceries: 10
    };

    // Calculate percentages for each expense category
    var percentages = {};
    Object.keys(expensesData).forEach(function (category) {
        percentages[category] = (expensesData[category] / totalIncome) * 100;
    });

    // Prepare data for the pie chart
    var pieChartData = {
        labels: Object.keys(expensesData),
        datasets: [{
            data: Object.values(percentages),
            backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'], // Adjust these colors
        }]
    };

    // Get the context of the canvas element we want to select
    var ctx = document.getElementById('myPieChart').getContext('2d');

    // Create the pie chart
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: pieChartData,
    });
  }, []);

  return (
    <canvas id="myPieChart" width="400" height="400"></canvas>
  );
};


class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datainfo: null,
    };
  }

  capture = () => {
    const node = document.getElementById("invoiceCapture");

    return domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        // console.log(dataUrl);
        return dataUrl; // Return the data URL
      })
      .catch(function (error) {
        console.error("Error capturing the DOM to image:", error);
        throw error; // Re-throw the error for handling
      });
  };

  GenerateTransactions = () => {
    getDocs(collection(fs, "kshitij", "February Expense", "transactions"))
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc);
        });
        console.log(data);
        this.setState({ datainfo: data }); // if you're using a class component
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  GenerateInvoice = () => {
    this.capture().then((himg) => {
      // Use the promise returned by capture
      const element = document.querySelector("#invoiceCapture");

      html2canvas(element, { scrollY: -window.scrollY }).then(
        async (canvas) => {
          const imgData = canvas.toDataURL("image/png", 1.0);
          const QRpdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: [612, 792],
          });

          const imgWidth = 612;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let position = 0;
          let pageHeight = QRpdf.internal.pageSize.getHeight();

          while (position < imgHeight) {
            const sliceHeight = Math.min(imgHeight - position, pageHeight);
            QRpdf.addImage(
              himg,
              "PNG",
              0,
              -position,
              imgWidth,
              imgHeight,
              null,
              "SLOW",
              "MEDIUM",
              0,
              true
            );
            position += sliceHeight;

            if (position < imgHeight) {
              QRpdf.addPage();
            }
          }
          QRpdf.save("WithQR.pdf");
        }
      );
    });
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.showModal}
          onHide={this.props.closeModal}
          size="lg"
          centered
        >
          <div id="invoiceCapture">
            <PieChart income={this.props.income} info={this.props.expense} />
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">BudgetBuddy</h4>
                <h6 className="fw-bold text-secondary mb-1">
                  MONTHLY EXPENDITURE
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Date&nbsp;:</h6>
                <h5 className="fw-bold text-secondary">
                {(new Date()).toLocaleDateString()}
                </h5>
                <h5 className="fw-bold text-secondary">
                  {(new Date()).toLocaleTimeString()}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <h4 className="fw-bold my-2">Income: {this.props.income}</h4>
              <h4 className="fw-bold my-2">Expenses: {this.props.expense}</h4>
              <h4 className="fw-bold my-2">Balance: {this.props.income - this.props.expense}</h4>
            </div>
            <div className="p-4">
            {this.state.datainfo && (
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>DATE & TIME</th>
                    <th>CATEGORY</th>
                    <th>PRODUCT</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                
                  <tbody>
                    {this.state.datainfo.map((item, i) => {
                      return (
                        <tr id={i} key={i}>
                          <td>
                            {item.data().datetime}
                          </td>
                          <td>{item.data().option}</td>
                          <td>
                            {item.data().product}
                          </td>
                          <td className="text-end">
                            {item.data().amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
              </Table>
              )}
            </div>
            <div className="p-4 text-end">
                Signed By 
                <img src="https://iili.io/JEEICOB.png" alt="JEEICOB.png" border="0" style={{ height: '125px', width: '125px'}} />
          
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row className="pb-2">
              <Col md={6}></Col>
              <Col md={6}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={this.GenerateTransactions}
                >
                  <BiCloudDownload
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  See Transactions
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={6}></Col>
              <Col md={6}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={this.GenerateInvoice}
                >
                  <BiCloudDownload
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3" />
      </div>
    );
  }
}

export default InvoiceModal;

