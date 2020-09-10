import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { useState } from 'react';

export const OrientationStep = (props) => {
  function confirmClicked() {
    props.confirmOrientationClicked()
  }

  function confirmEndClicked() {
    props.confirmEndIEPClicked()
  }

  return (
    <>
      <h4>Orientation is not completed </h4>
      <Grid>
        <Grid.Row>
          <Button onClick={confirmClicked} style={{ marginLeft: "1rem" }}>Confirm orientation completed</Button>
        </Grid.Row>
        <Grid.Row>
          <Button style={{ marginLeft: "1rem" }}>Assess Client</Button>
          <Button disabled style={{ marginLeft: "1rem" }}>Modify IEP Plan</Button>
          <Button onClick={confirmEndClicked} color="red" style={{ marginLeft: "1rem" }}>End IEP</Button>
        </Grid.Row>
      </Grid>

      <h2>NOTES</h2>
      <Button style={{ marginLeft: "1rem" }}>Add Notes</Button>

    </>);


}