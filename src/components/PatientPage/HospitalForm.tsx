import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Grid, Button, Alert, Typography} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useState, SyntheticEvent } from 'react';
import { Diagnosis, Patient } from '../../types';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import axios from 'axios';

interface Props {
  diagnoses: Diagnosis[]
  patient: Patient
  setPatient: React.Dispatch<React.SetStateAction<Patient>>
  setEntryForm: React.Dispatch<React.SetStateAction<string>>
}

const HospitalForm = ({ diagnoses, patient, setPatient, setEntryForm } : Props) => {

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [entryDiagnoses, setEntryDiagnoses] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [error, setError] = useState('');
  const id = useParams().id;

  const handleDiagnosisChange = (event: SelectChangeEvent<typeof entryDiagnoses>) => {
    const {
      target: { value },
    } = event;
    setEntryDiagnoses(typeof value === 'string' ? value.split(',') : value,);
  };

  const clearError = () => {
    setTimeout(() => {
      setError('');
    }, 4000);
  };

  const commonStyles = {
    padding: 2,
    height: '100%',
    width: '100%',
    marginBottom: 1,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'black',
    m: 1
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const addHEntry = async () => {
      if (id !== undefined) {
        try {
          const entry = await patientService.createEntry({
            description,
            date,
            specialist,
            diagnosisCodes: entryDiagnoses,
            discharge: { date: dischargeDate, criteria: dischargeCriteria },
            type: 'Hospital'
          }, id);
          const updatedPatient = {...patient};
          updatedPatient.entries.concat(entry);
          setPatient(updatedPatient);
          setEntryForm('');
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            if (e?.response?.data && typeof e?.response?.data === 'string') {
              const message = e.response.data.replace('Something went wrong. Error: ', '');
              console.error(message);
              setError(message);
              clearError();
            } else {
              setError('Unrecognized axios error');
              clearError();
            }
          } else {
            console.error('Unknown error', e);
            setError('Unknown error');
            clearError();
          }
        }
      } else {
        setError('Cannot find patient id');
        clearError();
      }
    };
    addHEntry();
  };

  return (
    <Box sx={{ ...commonStyles }}>
      {error !== '' && <Alert severity='error'>{error}</Alert>}
      <h4>New hospital entry</h4>
      <form onSubmit={addEntry}>
      <TextField id="standard-basic" fullWidth label="Description" value={description}
        variant="standard" onChange={({ target }) => setDescription(target.value)} 
        InputLabelProps={{ shrink: true }}/>
      <TextField style={{marginTop: 7, marginBottom: 7, width: 150}} type='date' id="standard-basic" value={date} 
        label="Select date:" variant="standard" onChange={({ target }) => setDate(target.value)} 
        InputLabelProps={{ shrink: true }} />
      <TextField id="standard-basic" fullWidth label="Specialist" value={specialist}
        variant="standard" onChange={({ target }) => setSpecialist(target.value)} 
        InputLabelProps={{ shrink: true }}/>
      <FormControl sx={{ minWidth: 250, marginTop: 2 }} size="small">
        <InputLabel id="demo-select-small-label">Diagnosis codes</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          multiple
          value={entryDiagnoses}
          label="Diagnosis codes"
          onChange={handleDiagnosisChange}>
          {diagnoses.map(d => 
            <MenuItem key={d.code} value={d.code}>{d.code}</MenuItem>
          )}
        </Select>
      </FormControl>
      <Typography variant='subtitle2' sx={{ marginTop: 1 }}>Discharge:</Typography>
      <TextField style={{marginTop: 7, marginBottom: 7, width: 150}} type='date' id="standard-basic" value={dischargeDate} 
        label="Select discharge date:" variant="standard" onChange={({ target }) => setDischargeDate(target.value)} 
        InputLabelProps={{ shrink: true }} />
      <TextField id="standard-basic" fullWidth label="Discharge criteria" value={dischargeCriteria}
        variant="standard" onChange={({ target }) => setDischargeCriteria(target.value)} 
        InputLabelProps={{ shrink: true }}/>
        <Grid container spacing={2} marginTop={0.1} width={'100%'}>
        <Grid item>
            <Button
              style={{
                float: 'left',
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'right' }}
              type="button"
              onClick={() => setEntryForm('')}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default HospitalForm;