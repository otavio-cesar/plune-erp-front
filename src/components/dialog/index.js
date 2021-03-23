import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { InputLabel, makeStyles, TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export function MeuDialog({
  open, title, message, action, setOpen,
  askReason, labelReason = "Motivo",
  askQntProduction, labelQntProduction = "Quantidade produzida na etapa"
}) {

  const [password, setPassword] = useState('');
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
    quantidadeProduzida: 0
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleYes = () => {
    if (askReason) {
      action(state.age)
    } else if (askQntProduction) {
      action(password)
    } else {
      action()
    }
    setOpen(!open);
  };

  const handleNo = () => {
    setOpen(!open);
  };

  return (
    <Dialog
      open={open}
      onClose={handleNo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleYes} >
        <DialogContent >
          <DialogContentText id="alert-dialog-description" >
            {message}
          </DialogContentText>

          {askReason &&
            <>
              <InputLabel htmlFor="age-native-simple" >{labelReason}:</InputLabel>
              <Select
                native
                value={state.age}
                onChange={handleChange}
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
                fullWidth
                required
              >
                <option aria-label="None" value="" />
                {
                  JSON.parse(localStorage.getItem('situations')).map(s => {
                    return <option value={s.id}>{s.value}</option>
                  })
                }
              </Select>
            </>
          }

          {askQntProduction &&
            <>
              <TextField
                className="line"
                id="standard-basic"
                label={labelQntProduction}
                required
                inputProps={{
                  name: 'quantidadeProduzida',
                }}
                type='number'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </>
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} color="primary">
            Não
          </Button>
          <Button color="primary" autoFocus type="submit">
            Sim
          </Button>
        </DialogActions>
      </form>
    </Dialog >
  );
}