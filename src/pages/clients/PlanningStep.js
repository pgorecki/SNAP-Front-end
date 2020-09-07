import React from 'react';
import { Button, Grid, Checkbox, Dropdown, Menu, Segment, Modal } from 'semantic-ui-react';
import { useState } from 'react';

export const PlanningStep = () => {
  const [isModidystate, setIsModifyState] = useState(false)

  const modifyiep = () => {
    setIsModifyState(true);
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
          <Button color="red" style={{ marginLeft: "1rem" }}>End IEP</Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button style={{ marginLeft: "1rem" }}>Add Notes</Button>

      {isModidystate && (
        <Modal size='tiny' open={true} >
          <h3 style={{ marginTop: "1rem", marginLeft: "1rem" }}>Select program for this IEP</h3>
          <Modal.Content scrolling={true}>
            <Segment color="blue">
              <Grid.Column style={{ marginTop: "1rem" }}>
                <Checkbox label="Child care"></Checkbox>
              </Grid.Column>
              <Grid.Column style={{ marginTop: "1rem" }}>
                <Checkbox label="Welding"></Checkbox>
              </Grid.Column>
              <Grid.Column style={{ marginTop: "1rem" }}>
                <Checkbox label="Job search assistance"></Checkbox>
              </Grid.Column>
              <Button style={{ marginLeft: "1rem" }} onClick={() => setIsModifyState(null)}>Cancel</Button>
              <Button primary style={{ marginTop: "1rem", marginLeft: "1rem" }}>Ok</Button>
            </Segment>
          </Modal.Content>
        </Modal>
      )}
    </>);
}