import React from 'react'
import { Button, Grid, Checkbox, Modal } from 'semantic-ui-react'
import { useState } from 'react'
import useFetchData from 'hooks/useFetchData';
import useApiClient from 'hooks/useApiClient';

const programs = [
    {
        "id": 1,
        "name": "Child care"
    },
    {
        "id": 2,
        "name": "Welding"
    },
    {
        "id": 3,
        "name": "Job search assistance"
    },
]


export const CheckBoxIep = (props) => {
    const [data, error, loading] = useFetchData(`/programs/`, {});
    const [Checked, setChecked] = useState(props.setPreData == null ? [] : props.setPreData);
    const [elements, setelements] = useState([]);
    const apiClient = useApiClient();
    const [existingEnrollmentPrograms, setExistingEnrollmentPrograms] = useState();
    const exitingP = SavedPrograms();

    async function SavedPrograms() {
        console.log(existingEnrollmentPrograms);
        if (typeof existingEnrollmentPrograms === 'undefined') {
            const resultPrograms = await apiClient.get(
                `/programs/enrollments/?client=${props.client.id}`
            );
            if (resultPrograms.data.count > 0) {
                setExistingEnrollmentPrograms(resultPrograms.data.results);
                console.log(existingEnrollmentPrograms);
            }
        }
    }

    if (typeof data.results === 'undefined') {
        return null;
    }
    if (props.setPreData != null) {

    }
    console.log(props);
    const handleCheck = (pvalue) => {
        console.log(pvalue);
        const currentIndex = Checked.indexOf(pvalue);
        const elements = [...Checked];
        let elem = new Object();
        let fbool = false;
        elem.id = pvalue["id"];
        elem.name = pvalue["name"];
        elem.programsIndex = pvalue;
        elements.forEach(e => {
            if (e["id"] == elem.id)
                fbool = true;
        });

        const objIndex = elements.indexOf(elem);
        if (fbool === false) {
            elements.push(elem);
        } else {
            elements.splice(objIndex, 1);
        }

        setChecked(elements)
        props.handleChecks(elements)
    }

    function PopulateChecked(value) {
        if (!!Checked) {
            console.log(Checked);
        }
        return false;
    }


    return (<>
        {
            typeof data.results !== 'undefined' ? data.results.map((value, index) => (
                <React.Fragment key={index}>
                    <Checkbox name={value["id"]} onChange={() => handleCheck(value)} style={{ marginTop: "1rem" }} />
                    <span style={{ marginLeft: "1rem" }}>{value.name}</span><br></br>
                </React.Fragment>

            )) : null
        }
    </>)
}