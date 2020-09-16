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
    const [Checked, setChecked] = useState([]);
    const [elements, setelements] = useState([]);
    const apiClient = useApiClient();
    const existingEnrolmments = props.setPreData == null ? [] : props.setPreData;

    if (typeof data.results === 'undefined') {
        return null;
    }
    if (props.setPreData != null) {

    }
    //console.log(props);
    const handleCheck = (pvalue) => {
        //setChecked(existingEnrolmments);
        //console.log(pvalue);
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
            //console.log(Checked);
        }
        return false;
    }


    return (<>
        {
            typeof data.results !== 'undefined' ? data.results.map((value, index) => (
                <React.Fragment key={index}>
                    <Checkbox name={value["id"]} onChange={() => handleCheck(value)} style={{ marginTop: "1rem" }} disabled={(existingEnrolmments.findIndex(x => x.program == value.id && (x.status == 'ENROLLED' || x.status == 'PLANNED')) === -1) ? false : true} />
                    <span style={{ marginLeft: "1rem" }}>{value.name}</span><br></br>
                </React.Fragment>

            )) : null
        }
    </>)
}