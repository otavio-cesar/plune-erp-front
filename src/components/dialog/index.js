import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { InputLabel, TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import React, { useState } from 'react';

export function MeuDialog({
  open, title, message, action, setOpen,
  askReason, labelReason = "Motivo",
  askQntProduction, labelQntProduction = "Quantidade produzida na etapa",
  askObservacao, labelObservacao = "Observação",
  askYesNo, labelYesNo = 'Aprovado',
  confirm = "Sim", notConfirm = "Não"
}) {

  const [quantity, setQuantity] = useState('');
  const [obs, setObs] = useState('');
  const [state, setState] = React.useState({
    reason: '',
    yesno: '',
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
      action(state.reason)
    } else {
      action(quantity, obs, state.yesno)
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
              <InputLabel htmlFor="reason-native-simple" >{labelReason}:</InputLabel>
              <Select
                native
                value={state.reason}
                onChange={handleChange}
                inputProps={{
                  name: 'reason',
                  id: 'reason-native-simple',
                }}
                fullWidth
                required
              >
                <option aria-label="None" value="" />
                {
                  JSON.parse(localStorage.getItem('situations')).map((s, i) => {
                    return <option key={i} value={s.id}>{s.value}</option>
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
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
              />
            </>
          }

          {askYesNo &&
            <>
              <InputLabel
                htmlFor="yesno-native-simple"
                style={{ marginTop: '10px', transform: 'scale(0.75)' }}
              >
                {labelYesNo}*
              </InputLabel>
              <Select
                native
                value={state.yesno}
                onChange={handleChange}
                inputProps={{
                  name: 'yesno',
                  id: 'yesno-native-simple',
                }}
                fullWidth
                required
              >
                <option aria-label="None" value="" />
                {
                  [{ value: 'Sim', id: true }, { value: 'Não', id: false }].map((s, i) => {
                    return <option key={i} value={s.id}>{s.value}</option>
                  })
                }
              </Select>
            </>
          }

          {askObservacao &&
            <>
              <TextField
                style={{ marginTop: '10px' }}
                className="line"
                id="standard-basic"
                label={labelObservacao}
                required
                inputProps={{
                  name: 'observacao',
                }}
                type='text'
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                fullWidth
              />
            </>
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} color="primary">
            {notConfirm}
          </Button>
          <Button color="primary" autoFocus type="submit">
            {confirm}
          </Button>
        </DialogActions>
      </form>
    </Dialog >
  );
}