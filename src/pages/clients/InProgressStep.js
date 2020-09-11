import React from 'react';
import { Button, Grid, Checkbox } from 'semantic-ui-react';
import { useState } from 'react';
import { handleChecks, PlanningStep } from './PlanningStep';


export const InProgressStep = (props) => {
  const [isModidystate, setIsModifyState] = useState(false)
  const [listInitialPrograms, setListInitialPrograms] = useState(props.listPrograms);
  const modifyiep = () => {
    setIsModifyState(true);
  }


  return (
    <>
      <div>
        {listInitialPrograms == null ? <h4>No programs are planned yet.Please modify IEP plan </h4> : listInitialPrograms.map((p, index) => (
          <li key={p["id"]}>
            {p["name"]}
          </li>
        ))}
      </div>
      {/* <h4>No programs are planned yet.Please modify IEP plan </h4> */}
      <Grid>
        <Grid.Row>
          <Button style={{ marginLeft: "1rem" }}>Assess Client</Button>
          <Button onClick={modifyiep} button >
            Modify IEP plan
                </Button>
          <Button color="red" style={{ marginLeft: "1rem" }}>End IEP</Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button style={{ marginLeft: "1rem" }}>Add Notes</Button>
    </>
  )
}