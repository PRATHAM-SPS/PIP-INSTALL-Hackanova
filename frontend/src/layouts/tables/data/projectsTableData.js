/* eslint-disable react/prop-types */
// @mui material components
import Icon from "@mui/material/Icon";

// PIP INSTALL Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";
import { fs } from "layouts/authentication/firebase";
import { doc, setDoc, getDoc,getDocs, updateDoc } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";

// Images
import AdobeXD from "examples/Icons/AdobeXD";
import Atlassian from "examples/Icons/Atlassian";
import Slack from "examples/Icons/Slack";
import Spotify from "examples/Icons/Spotify";
import Jira from "examples/Icons/Jira";
import Invision from "examples/Icons/Invision";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoWebDev from "assets/images/small-logos/logo-webdev.svg";
import logoXD from "assets/images/small-logos/logo-xd.svg";

function Completion({ value, color }) {
  return (
    <VuiBox display="flex" flexDirection="column" alignItems="flex-start">
      <VuiTypography variant="button" color="white" fontWeight="medium" mb="4px">
        {value}%&nbsp;
      </VuiTypography>
      <VuiBox width="8rem">
        <VuiProgress value={value} color={color} sx={{ background: "#2D2E5F" }} label={false} />
      </VuiBox>
    </VuiBox>
  );
}
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthIndex = (new Date().getMonth());
let monthName = monthNames[monthIndex];
let rows = []
try {
  const querySnapshot = await getDocs(collection(fs, "kshitij", `${monthName} Expense`, "transactions"));
  rows = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      Date: data.datetime,
      Category: data.option,
      Product: data.product,
      Amount: data.amount,
    };
  });

  // Now you can use the rows array in your component
  console.log("Rows:", rows);
} catch (e) {
  console.error("Error fetching data:", e);
}
const action = (
  <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
    more_vert
  </Icon>
);

export default {
  columns: [
    { name: "Date", align: "left" },
    { name: "Category", align: "left" },
    { name: "Product", align: "left" },
    { name: "Amount", align: "center" },
  ],
  rows: rows,
};
