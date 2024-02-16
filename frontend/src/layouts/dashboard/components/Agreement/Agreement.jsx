import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

// const [image, setImage] = useState();
import domtoimage from 'dom-to-image';
//

//

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfsHash: null,
    };
  }
 capture =  () => {
  const node = document.getElementById('invoiceCapture');

  return domtoimage.toPng(node)
    .then(function (dataUrl) {
      // console.log(dataUrl);
      return dataUrl; // Return the data URL
    })
    .catch(function (error) {
      console.error('Error capturing the DOM to image:', error);
      throw error; // Re-throw the error for handling
    });
};

Verify = async() => {
/// Uploading to ipfs without qr
this.capture().then((himg) => { // Use the promise returned by capture
  const element = document.querySelector("#invoiceCapture");

  html2canvas(element, { scrollY: -window.scrollY }).then(async (canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",   
      format: [612, 792],
    });

    const imgWidth = 612;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let pageHeight = pdf.internal.pageSize.getHeight();

    while (position < imgHeight) {
      const sliceHeight = Math.min(imgHeight - position, pageHeight);
      pdf.addImage(
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
        pdf.addPage();
      }
    }
    const pdfBlob = pdf.output('blob')

    const formData = new FormData();
      formData.append("file", pdfBlob);

      // const pinataresponse = await axios.post(
      //   "https://api.pinata.cloud/pinning/pinFileToIPFS",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       'pinata_api_key': "343511a4461af717ffa0",
      //       'pinata_secret_api_key':
      //         "ba091478c566ec2ca3ba1822ba6d94844fb06c0d01d25537c23af4c93720944a",
      //     },
      //   },
      // );
      // console.log(pinataresponse.data.IpfsHash);
      // this.setState({ ipfsHash: pinataresponse.data.IpfsHash });
  });
}).catch((error) => {
  console.error('Error generating invoice:', error);
});
}

  GenerateInvoice = async () => {

  //// Savng to local device with qr

  // const delayProcess = setTimeout(() => {
    this.capture().then((himg) => { // Use the promise returned by capture
      const element = document.querySelector("#invoiceCapture");

      html2canvas(element, { scrollY: -window.scrollY }).then(async (canvas) => {
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
        QRpdf.save('WithQR.pdf')
      });
    })
  // },0);
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
          <div id="invoiceCapture" style={{ zIndex: "1" }}>
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">
                  {this.props.info.billFro || "DEED OF TRANSFER"}
                </h4>
                <h6 className="fw-bold text-secondary mb-1">
                  {/* Invoice #: {this.props.info.invoiceNumber||''} */}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {" "}
                  ETH{" "}
                  {this.props.info.propertyPrice +
                    this.props.info.propertyPrice * 0.05}{" "}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={8} className="d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">Transferred From:</div>
                    <div>{this.props.info.billFrom || ""}</div>
                    <div>{this.props.info.billFromAddress || ""}</div>
                    <div>{this.props.info.billFromEmail || ""}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">Date Of Issue:</div><br></br>
                    <div>{this.props.info.dateOfIssue || ""}</div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Transferred to:</div>
                  <div>{this.props.info.billTo || ""}</div>
                  <div>{this.props.info.billToAddress || ""}</div>
                  <div>{this.props.info.billToEmail || ""}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <tbody>
                  <hr></hr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    THIS DEED OF TRANSFER made at Mumbai, this{" "}
                    {this.props.info.dateOfIssue} BETWEEN MR/Mrs:-{" "}
                    <b>{this.props.info.billFrom || ""}</b> age:-{" "}
                    <b>{this.props.info.billFromAge || ""} </b> years, an Indian
                    Inhabitant, residing at{" "}
                    <b>{this.props.info.billFromHAddress || ""}</b> city pin
                    code:- <b>{this.props.info.billFromPin || ""}</b> Pan No:-{" "}
                    <b>{this.props.info.billFromPan || ""}</b> Aadhar Number:-{" "}
                    <b>{this.props.info.billFromAdhar || ""}</b> hereinafter
                    called <b>"THE TRANSFEROR"</b> (which expression shall
                    unless it be repugnant to the context or meaning thereof
                    mean and include his heirs, executors and administrators) of
                    the ONE PART:
                  </tr>
                  <tr>
                    <b style={{ alignContent: "center" }} className="m-10">
                      AND
                    </b>
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    MR/Mrs:- <b>{this.props.info.billTo || ""}</b> age:-{" "}
                    <b>{this.props.info.billToAge || ""}</b> years an Indian
                    Inhabitant, residing at{" "}
                    <b>{this.props.info.billToHAddress || ""}</b> pin code:-{" "}
                    <b>{this.props.info.billToPin || ""}</b> Pan No:-{" "}
                    <b>{this.props.info.billToPan || ""}</b> Aadhar Number:-{" "}
                    <b>{this.props.info.billToAdhar || ""}</b> hereinafter
                    called <b>"THE TRANSFEREE</b>" (which expression shall
                    unless it be repugnant to the context or meaning thereof
                    mean and include her heirs, executors, administrators and
                    assigns) of the OTHER PART
                  </tr>
                  <hr></hr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    WHEREAS by an previous Agreement, registered in the office
                    of Sub-Registrar of Assurances. for the consideration and on
                    the terms and conditions contained therein, this flat has
                    purchased from the DEVELOPERS / Builder /Owner{" "}
                    <b>{this.props.info.lastOwner}</b>..the Residential Premises
                    bearing address{" "}
                    <b>
                      {this.props.info.propertyAddress} of{" "}
                      {this.props.info.propertyPrice} Sq. Ft. Carpet
                    </b>{" "}
                    /Built up/Super Built up area or thereabouts, Exclusive Car
                    parking Space. of the Building in Mumbai City / Mumbai
                    Suburban (hereinafter for the sake of brevity referred to as
                    "the said Flat").
                  </tr>
                  <tr
                    style={{ width: "100px", fontSize: "14px" }}
                    className="mt-2"
                  >
                    AND WHEREAS incidental to the holding of the said Premises,
                    the said {this.props.info.billFrom}..are enjoying membership
                    rights.; the Society formed and registered under the
                    Maharashtra Co-operative Societies Act, 1960.(hereinafter
                    for the sake of brevity referred to as "the said Society")
                    covered by Five fully paid up shares (both inclusive)
                    incorporated in the Share Certificate hereinafter for the
                    sake of brevity referred to as "the said Shares" of the said
                    Society. AND WHEREAS as on today the TRANSFEROR is the
                    absolute Owner of the said Premises and enjoying membership
                    rights of the said Society.
                  </tr>
                  <hr></hr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    AND WHEREAS on coming to know the intention of the
                    TRANSFEROR regarding sale of the said Premises, the
                    TRANSFEREE approached the TRANSFEROR and negotiated for sale
                    and transfer of the said Premises and the said shares of the
                    Society in his/her favor and the TRANSFEROR made following
                    representations to the TRANSFEREE in respect of the said
                    Premises i.e.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    * There are no suits, litigation, civil or criminal or any
                    other proceedings pending as against the <b>TRANSFEROR</b>{" "}
                    in respect of the said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    * There are no attachments or prohibitory orders against the
                    said Premises and the said Premises is not subject matter of
                    any lispendance or attachments either before or after
                    judgments.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    * The <b>TRANSFEROR</b> has not received any notice either
                    from Income Tax authorities or any other statutory body or
                    authorities regarding the acquisition or requisition of the
                    said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    * There are no encumbrances created against the said
                    Premises and the title of the <b>TRANSFEROR</b> to the said
                    Premises are clear, marketable and free from all other
                    encumbrances
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    * Except <b>TRANSFEROR</b>, no other person or authority
                    have got right, title or interest of whatsoever nature
                    against the said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    * The <b>TRANSFEROR</b> has not been adjudicated insolvent
                    nor he has committed any act of insolvency nor is there any
                    order of any Court or Authority restraining him or creating
                    any inability from entering in to this agreement.
                  </tr>
                  <hr></hr>
                  <tr>
                    Relying upon the aforesaid representations made by the{" "}
                    <b>TRANSFEROR</b>, the <b>TRANSFEREE</b> agreed to purchase
                    the said Premises on ownership basis and incidental thereto
                    transfer of the said Shares of the said Society for the
                    consideration of ETH {this.props.info.propertyPrice} and on
                    the terms and conditions appearing hereinafter.
                  </tr>
                  <hr></hr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    1. The recitals contained herein shall form the integral
                    part of this Agreement as if the same are set out and
                    incorporated herein.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    2. The <b>TRANSFEROR</b> declares that he is the absolute
                    owner of the said Premises and enjoying membership rights of
                    the said Society and he is holding the said Premises quietly
                    without any claim or obstruction from any other person. The{" "}
                    <b>TRANSFEROR</b> further declares that notwithstanding any
                    act, deed, matter or thing whatsoever by the TRANSFEROR or
                    any person or persons lawfully or equitably claiming by,
                    from , through, under or in trust for him made, done,
                    committed or omitted or knowingly suffered to the contrary,
                    the TRANSFEROR has good right, full power and absolute
                    authority to convey, transfer and assure the said Premises
                    hereby agreed to be transferred, conveyed and assigned in
                    favour of the <b>TRANSFEREE</b> as aforesaid and he has not
                    done, committed or omitted any act, deed, matter or thing
                    whereby the ownership, possession or occupation and
                    enjoyment of the said Premises may be rendered void or
                    voidable.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    3. On receiving full consideration as mentioned herein
                    above, the <b>TRANSFEROR</b> shall hand over to the{" "}
                    <b>TRANSFEREE</b>, the title documents in his custody, in
                    respect of the said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    4. If any person claims any right, title or interest in the
                    said Premises through the <b>TRANSFEROR</b> and thereby the{" "}
                    <b>TRANSFEREE</b> is put to any losses, expenses, then in
                    such event the <b>TRANSFEROR</b> agrees and undertakes to
                    indemnify and keep indemnified the <b>TRANSFEREE</b> against
                    all claims, actions, demands and proceedings arising in
                    respect of the said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    5. In the event of any dispute pertaining to any matter
                    relating to the transaction or any matter arising out of the
                    interpretation of this Agreement shall be referred to sole
                    arbitrator appointed by both the parties hereto and thus,
                    disputes and differences shall be resolved in accordance
                    with the provisions of Arbitration & Conciliation Act, 1996.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    6. The <b>TRANSFEROR</b> declares that the said Premises is
                    free from all encumbrances and the same is not mortgaged or
                    in any manner charged for payment of any money to any person
                    or Financial Institutions. The <b>TRANSFEROR</b> further
                    declares that he has not entered into any agreement for
                    transfer, sale or leave and licence or let out in respect of
                    the said Premises with any other person or persons.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    7. At present the said Premises is in lawful possession of
                    the <b>TRANSFEROR</b>. Without reserving any right, the{" "}
                    <b>TRANSFEROR</b> shall hand over peaceful physical
                    possession of the said Premises to the <b>TRANSFEREE</b> on
                    receiving the full consideration as agreed. The{" "}
                    <b>TRANSFEROR</b> do hereby covenant with the{" "}
                    <b>TRANSFEREE</b> that after taking possession of the said
                    Premises, the <b>TRANSFEREE</b> shall enjoy quietly and
                    peacefully and occupy the said Premises without any
                    hindrance, denial, demands, interruption or eviction by the{" "}
                    <b>TRANSFEROR</b> or any person lawfully or equitably
                    claiming through, under or in trust for the{" "}
                    <b>TRANSFEROR</b>.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    8. All the taxes, electricity charges, maintenance charges
                    and other outgoings in respect of the said Premises shall be
                    paid by the <b>TRANSFEREE</b> from the date of taking over
                    possession and till then, the <b>TRANSFEROR</b> shall pay
                    all the taxes, electricity charges, maintenance charges and
                    outgoings to the respective Authorities.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    9. The <b>TRANSFEREE</b> confirms that before execution of
                    this Agreement, she has inspected the said Premises and
                    satisfied herself regarding area, quality of construction
                    and condition thereof. In future, the <b>TRANSFEREE</b>{" "}
                    shall not raise any objection or dispute regarding the said
                    issues. If further renovation or repairs are required, the
                    same shall be done by the <b>TRANSFEREE</b>.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    10. The <b>TRANSFEREE</b> shall abide herself by the rules
                    and regulations of the said Society and pay the taxes and
                    all other outgoing in respect of the said Premises, as and
                    when the same become due for payment and keep the{" "}
                    <b>TRANSFEROR</b> indemnified in respect thereof till the
                    time the <b>TRANSFEREE</b> is admitted as the member of the
                    said Society in respect of the said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    10. The TRANSFEREE shall abide herself by the rules and
                    regulations of the said Society and pay the taxes and all
                    other outgoing in respect of the said Premises, as and when
                    the same become due for payment and keep the{" "}
                    <b>TRANSFEROR</b> indemnified in respect thereof till the
                    time the <b>TRANSFEREE</b> is admitted as the member of the
                    said Society in respect of the said Premises.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    11. The <b>TRANSFEROR</b> and the <b>TRANSFEREE</b> will
                    execute necessary documents as and when required for giving
                    proper effect to what is agreed herein and to transfer the
                    said shares and the said Premises to the <b>TRANSFEREE</b>{" "}
                    in the books of the said Society and other appropriate
                    authorities.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    12. The <b>TRANSFEROR</b> shall obtain the consent or no
                    objection from the said Society for transferring the said
                    Premises in favour of the <b>TRANSFEREE</b>.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    13. The premium / Transfer fee of the said Society in
                    respect of the transfer of the said shares and the said
                    Premises will be borne and paid by the <b>TRANSFEROR</b> and
                    the <b>TRANSFEREE</b>, equally.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    14. Electricity/ Water meters/Mahanagar Gas, Sinking Fund
                    and all the amount standing to the credit of the{" "}
                    <b>TRANSFEROR</b> in the books of the said Society in
                    respect of the said Premises shall be transferred in the
                    name of the <b>TRANSFEREE</b> on payment of full
                    consideration as agreed.
                  </tr>
                  <tr style={{ width: "100px", fontSize: "14px" }}>
                    15. The Stamp Duty and Registration charges of this
                    Agreement shall be borne and paid by the <b>TRANSFEREE</b> /{" "}
                    <b>TRANSFEROR</b> alone. The Parties here to undertake to
                    comply with all the formalities required for completing the
                    registration of this Agreement in respect of the said
                    Premises in the record of the Sub-Registrar of assurances.
                  </tr>
                  <tr
                    style={{
                      width: "100px",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    16. The <b>TRANSFEROR</b> shall from time to time and at all
                    reasonable times do and execute or cause to be done and
                    executed all such acts, deeds and things whatsoever for more
                    perfectly securing the right, title and interest of the
                    TRANSFEROR in the said Premises agreed to be sold and
                    transferred unto and to the use of the <b>TRANSFEREE</b>.
                  </tr>
                  <tr
                    style={{
                      width: "100px",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                  </tr>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "center", // Horizontal centering
                      alignItems: "center",     // Vertical centering
                      width: "100%",            // Take full width of parent container
                      fontSize: "4px",
                      marginBottom: "5px",
                      alignmentBaseline: "center",
                    }}
                  >
                        <img
                        alt="QR"
                        width="150px"
                        height="150px"
                      ></img>
                  </tr>
                  <tr
                    style={{
                      display: "flex",
                      justifyContent: "center", // Horizontal centering
                      alignItems: "center",     // Vertical centering
                      width: "100%",            // Take full width of parent container
                      fontSize: "10px",
                      marginBottom: "30px",
                      marginTop: "30px",
                      alignmentBaseline: "center",
                    }}
                    >
                    <div><b>Signed By <h1 className="m-0 text-primary">Makaan</h1> </b></div>    
                  <br></br>
                  <br></br>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
          <div className="pb-4 px-2">
            <Row className="justify-content-center mb-3">
              <Col  md={6} className="d-flex justify-content-center">
                <Button
                  variant="outline-primary"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={this.Verify}
                >
                  <BiCloudDownload
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Upload Deed to IPFS for verification
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col  md={6} className="d-flex justify-content-center">
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

