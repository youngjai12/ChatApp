import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useContext, useRef } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import {SocketContext} from "@components/VTList/context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
}));

interface SidebarProps {
  children: React.ReactNode;
  user: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {
  console.log(`passed user: ${user}`)
  const socketContext = useContext(SocketContext);
  const classes = useStyles();
  if (!socketContext) {
    return null;
  }
  const { me, stream, callAccepted, name, setName, callEnded, leaveCall, callUser, toggleRecording, recording  } = socketContext

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(user)} className={classes.margin}>
                  Call to {user}
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Button onClick={toggleRecording}>{recording ? 'Stop Recording' : 'Start Recording'}</Button>
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Sidebar;
