import { useState, useEffect } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// Bootstrap Paradox Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Bootstrap Paradox Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import axios from "axios";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/signInImage.png";



function Split() {

    const amt = 0;
    const email = "";


    const onSubmit = async (e) => {
        setSplit(split)

        setMessage("You lost 1 Terra Reward, try to use renewable resource next time")
        axios.post("http://localhost:4000/send_point_mail", { "email": email, "amt": amt }).then(e => console.log(e))

    }

    return (
        (<CoverLayout
            title="Split Bills with Ease"
            color="white"
            description="Enter your friend's email seperated by a single comma (,)"
            premotto="INSPIRED BY THE PRESENT"
            motto="A treat for your friends and a treat for your pocket"
            image={bgSignIn}
        >
            <VuiBox component="form" role="form">

                <VuiBox mb={2}>
                    <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            E-mails
                        </VuiTypography>
                    </VuiBox>
                    <GradientBorder
                        minWidth="100%"
                        borderRadius={borders.borderRadius.lg}
                        padding="1px"
                        backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                        )}
                    >
                        <VuiInput
                            value="Hello"
                            onChange={(e) => setEmail(e.target.valueAsNumber)}
                            type='text'
                            placeholder="Education Expenditure"
                            sx={({ typography: { size } }) => ({
                                fontSize: size.sm,
                            })}
                        />
                    </GradientBorder>
                </VuiBox>
                <VuiBox mb={2}>
                    <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Bill Amt
                        </VuiTypography>
                    </VuiBox>
                    <GradientBorder
                        minWidth="100%"
                        borderRadius={borders.borderRadius.lg}
                        padding="1px"
                        backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                        )}
                    >
                        <VuiInput
                            value={amt}
                            onChange={(e) => setBills(e.target.valueAsNumber)}
                            type="number"
                            placeholder="Your monthly bills"
                            sx={({ typography: { size } }) => ({
                                fontSize: size.sm,
                            })}
                        />
                    </GradientBorder>
                </VuiBox>


                <VuiBox mt={4} mb={1}>
                    <VuiButton color="info" onClick={onSubmit} fullWidth>
                        SPLIT THE BILL
                    </VuiButton>
                </VuiBox>
                {(amt > 0) ?
                    (<VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="success" fontWeight="medium">
                            "You have split {split} monthly to spend on miscellaneous things"
                        </VuiTypography>
                    </VuiBox>) :
                    (<VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="error" fontWeight="medium">
                            "jitni chadar ho utna hin pair failana chahiye"
                        </VuiTypography>
                    </VuiBox>)}
            </VuiBox>
        </CoverLayout>)
            (<CoverLayout
                title="Split the Bill with Ease"
                color="white"
                description="Enter your friend's email seperated by a single comma (,)"
                premotto="INSPIRED BY THE PRESENT"
                motto="A treat for your friends and a treat for your pocket"
                image={bgSignIn}
            >
                <VuiBox component="form" role="form">
                    <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                E-mails
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            borderRadius={borders.borderRadius.lg}
                            padding="1px"
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput disabled
                                value={email}
                                onChange={(e) => setEmail(e.target.valueAsNumber)}
                                type="number"
                                placeholder="Education Expenditure"
                                sx={({ typography: { size } }) => ({
                                    fontSize: size.sm,
                                })}
                            />
                        </GradientBorder>
                    </VuiBox>
                    <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                                Bill Amount
                            </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                            minWidth="100%"
                            borderRadius={borders.borderRadius.lg}
                            padding="1px"
                            backgroundImage={radialGradient(
                                palette.gradients.borderLight.main,
                                palette.gradients.borderLight.state,
                                palette.gradients.borderLight.angle
                            )}
                        >
                            <VuiInput disabled
                                value={amt}
                                onChange={(e) => setBills(e.target.valueAsNumber)}
                                type="number"
                                placeholder="Your monthly bills"
                                sx={({ typography: { size } }) => ({
                                    fontSize: size.sm,
                                })}
                            />
                        </GradientBorder>
                    </VuiBox>


                    <VuiBox mt={4} mb={1}>
                        <VuiButton color="info" onClick={onSubmit} fullWidth disabled>
                            SPLIT THE BILL
                        </VuiButton>
                    </VuiBox><VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="success" fontWeight="medium">
                            "Your friends have been notified!"
                        </VuiTypography>
                    </VuiBox>
                </VuiBox>
            </CoverLayout>)
    );
}

export default Split;
