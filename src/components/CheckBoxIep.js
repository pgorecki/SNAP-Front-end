import React from 'react'
import { Button, Grid, Checkbox, Modal } from 'semantic-ui-react'
import { useState } from 'react'

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

    const [Checked, setChecked] = useState([])

    const handleCheck = (value) => {

        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];

        if (currentIndex === -1) {
            newChecked.push(value)
        }
        else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleChecks(newChecked)
    }


    return (<>
        {programs.map((value, index) => (
            <React.Fragment key={index}>
                <Checkbox onChange={() => handleCheck(value.name)} style={{ marginTop: "1rem" }} />
                <span style={{ marginLeft: "1rem" }}>{value.name}</span><br></br>
            </React.Fragment>

        ))}
    </>)
}