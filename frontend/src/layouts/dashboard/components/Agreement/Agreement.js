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
import { fs } from "layouts/authentication/firebase";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";

let data = []

function GenerateInvoice() {

  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
      // console.log(this.props.info.data().amount);
    // data = this.props.info
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
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">BudgetBuddy</h4>
                <h6 className="fw-bold text-secondary mb-1">
                  MONTHLY EXPENDITURE
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {" "}
                  {this.props.expense} {this.props.income}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>DATE & TIME</th>
                    <th>CATEGORY</th>
                    <th className="text-end">PRODUCT</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{ width: "70px" }}>{item.datetime}</td>
                        <td>
                          {item.category}
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {item.product}
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {item.amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}></Col>
              <Col md={6}>
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={GenerateInvoice}
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

