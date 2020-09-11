import React from 'react';
import { Button, Grid, Checkbox, Dropdown, Menu, Segment, Modal } from 'semantic-ui-react';
import { useState } from 'react';
import { CheckBoxIep } from '../../components/CheckBoxIep'

export const PlanningStep = (props) => {
  const [isModidystate, setIsModifyState] = useState(false)
  const [checkPrograms, setCheckedPrograms] = useState(null)
  const modifyiep = () => {
    setIsModifyState(true);
  }

  const handleChecks = (checks, category) => {
    setCheckedPrograms(checks);
    //console.log(checks)
  }


  function confirmEndClicked() {
    props.confirmEndIEPClicked();
  }

  function modifyOkButtonClicked() {
    //console.log(checkPrograms);
    props.modifyOkButtonClicked(checkPrograms);
    setIsModifyState(null);
  }

  return (
    <>
      <h4>No programs are planned yet.Please modify IEP plan </h4>
      <Grid>
        <Grid.Row>
          <Button style={{ marginLeft: "1rem" }}>Assess Client</Button>
          <Button onClick={modifyiep} button >
            Modify IEP plan
                </Button>
          <Button onClick={confirmEndClicked} color="red" style={{ marginLeft: "1rem" }}>End IEP</Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button style={{ marginLeft: "1rem" }}>Add Notes</Button>

      {isModidystate && (
        <Modal size='tiny' open={true} >
          <h3 style={{ marginTop: "1rem", marginLeft: "1rem" }}>Select program for this IEP</h3>
          <Modal.Content scrolling={true}>
            <CheckBoxIep handleChecks={checks => handleChecks(checks, "programs")} />
            <Button style={{ marginLeft: "1rem" }} onClick={() => setIsModifyState(null)}>Cancel</Button>
            <Button onClick={modifyOkButtonClicked} primary style={{ marginTop: "1rem", marginLeft: "1rem" }}>Ok</Button>

          </Modal.Content>
        </Modal>
      )}
    </>);
}